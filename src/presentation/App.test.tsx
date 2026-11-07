import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { allCases } from '../data/cases';
import { buildCaseFile } from '../testing/buildCaseFile';
import { createInMemoryProgress, createInMemoryTutorial } from '../testing/inMemoryStorage';
import { App } from './App';

function renderApp({ tutorialSeen = true, progress = {}, caseFile = buildCaseFile() } = {}) {
  const progressStorage = createInMemoryProgress(progress);
  const tutorialStorage = createInMemoryTutorial(tutorialSeen);
  const user = userEvent.setup();

  render(<App cases={[caseFile]} progressStorage={progressStorage} tutorialStorage={tutorialStorage} />);

  return { user, progressStorage, tutorialStorage };
}

async function openCase(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Investigar.*Caso de teste/ }));
}

describe('tutorial', () => {
  it('abre sozinho na primeira visita e percorre os passos até começar', async () => {
    const { user, tutorialStorage } = renderApp({ tutorialSeen: false });

    expect(screen.getByRole('dialog', { name: 'Seu objetivo' })).toBeInTheDocument();

    for (let step = 0; step < 5; step += 1) {
      await user.click(screen.getByRole('button', { name: 'Próximo' }));
    }

    expect(screen.getByRole('dialog', { name: 'Faça a acusação' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Começar a investigar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(tutorialStorage.hasSeen()).toBe(true);
  });

  it('não abre sozinho depois de visto, mas reabre pelo botão Como jogar', async () => {
    const { user } = renderApp({ tutorialSeen: true });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Como jogar' }));

    expect(screen.getByRole('dialog', { name: 'Seu objetivo' })).toBeInTheDocument();
  });

  it('permite voltar um passo e fecha com Escape', async () => {
    const { user } = renderApp({ tutorialSeen: false });

    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(screen.getByRole('dialog', { name: 'Seu objetivo' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('escolha do caso', () => {
  it('lista os casos com dificuldade e sem resultado no começo', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: 'Caso de teste' })).toBeInTheDocument();
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('Ainda sem resultado')).toBeInTheDocument();
  });

  it('mostra as estrelas de quem já resolveu', () => {
    renderApp({ progress: { 'test-case': { caseId: 'test-case', stars: 2, inspectedCount: 2, wrongAccusationCount: 1 } } });

    expect(screen.getByRole('img', { name: '2 de 3 estrelas' })).toBeInTheDocument();
    expect(screen.getByText('Detetive')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Investigar de novo/ })).toBeInTheDocument();
  });

  it('renderiza os casos reais do jogo', () => {
    render(<App cases={allCases} progressStorage={createInMemoryProgress()} tutorialStorage={createInMemoryTutorial(true)} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(allCases.length);
  });
});

describe('investigação', () => {
  it('revela a pista ao investigar um lugar e guarda no caderno', async () => {
    const { user } = renderApp();
    await openCase(user);

    expect(screen.getByText('Nenhuma pista ainda. Investigue um lugar para começar.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));

    const notebook = screen.getByRole('region', { name: 'Caderno de pistas' });
    expect(within(notebook).getByText(/Quem abriu usa a mão esquerda/)).toBeInTheDocument();
    expect(screen.getByText(/Lugares investigados:/)).toHaveTextContent('1 de 3');
    expect(screen.queryByRole('button', { name: 'Investigar Escritório' })).not.toBeInTheDocument();
  });

  it('descarta e restaura suspeitos', async () => {
    const { user } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Descartar Bruno' }));
    expect(screen.getByText('Descartado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acusar Bruno' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Voltar a suspeitar de Bruno' }));
    expect(screen.queryByText('Descartado')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acusar Bruno' })).toBeEnabled();
  });

  it('mostra o perfil de cada suspeito', async () => {
    const { user } = renderApp();
    await openCase(user);

    expect(screen.getByText(/Mão dominante · Calçado · Bebida favorita · Estava às 21h em/)).toBeInTheDocument();
    expect(screen.getByText('salto alto')).toBeInTheDocument();
    expect(screen.getByText('Cozinheira')).toBeInTheDocument();
  });

  it('pede confirmação antes de acusar e permite cancelar', async () => {
    const { user } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Acusar Bruno' }));
    expect(screen.getByRole('dialog', { name: 'Acusar Bruno?' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText(/Tentativas restantes:/)).toHaveTextContent('3');
  });

  it('explica qual pista contradiz uma acusação errada e gasta uma tentativa', async () => {
    const { user } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: 'Acusar Bruno' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));

    expect(screen.getByRole('status')).toHaveTextContent(/Bruno é inocente.*Quem abriu usa a mão esquerda.*Restam 2 tentativas/);
    expect(screen.getByText(/Tentativas restantes:/)).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: 'Acusar Bruno' })).toBeDisabled();
  });

  it('orienta a investigar mais quando nenhuma pista contradiz o acusado', async () => {
    const { user } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Acusar Bruno' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));

    expect(screen.getByRole('status')).toHaveTextContent(/investigue mais lugares/);
  });
});

describe('quadro de dedução', () => {
  it('abre uma coluna nova no quadro para cada pista descoberta', async () => {
    const { user } = renderApp();
    await openCase(user);

    expect(screen.getByText('Investigue um lugar para liberar a primeira coluna do quadro.')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'P1' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: 'Investigar Jardim' }));

    expect(screen.getByRole('columnheader', { name: 'P1' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'P2' })).toBeInTheDocument();
  });

  it('alterna a marca da célula entre ?, combina e não combina', async () => {
    const { user } = renderApp();
    await openCase(user);
    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));

    const cell = () => screen.getByRole('button', { name: /^Ana, pista 1/ });

    expect(cell()).toHaveTextContent('?');
    await user.click(cell());
    expect(cell()).toHaveTextContent('✓');
    expect(cell()).toHaveAccessibleName('Ana, pista 1: combina');
    await user.click(cell());
    expect(cell()).toHaveTextContent('✗');
    expect(cell()).toHaveAccessibleName('Ana, pista 1: não combina');
    await user.click(cell());
    expect(cell()).toHaveTextContent('?');
  });

  it('mantém as marcas ao investigar outro lugar', async () => {
    const { user } = renderApp();
    await openCase(user);
    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: /^Bruno, pista 1/ }));
    await user.click(screen.getByRole('button', { name: 'Descartar Carla' }));

    await user.click(screen.getByRole('button', { name: 'Investigar Jardim' }));

    expect(screen.getByRole('button', { name: /^Bruno, pista 1/ })).toHaveTextContent('✓');
    expect(screen.getByRole('button', { name: /^Bruno, pista 2/ })).toHaveTextContent('?');
    expect(screen.getByRole('button', { name: 'Voltar a suspeitar de Carla' })).toBeInTheDocument();
  });

  it('não corrige as marcas do jogador nem mostra qual suspeito combina', async () => {
    const { user } = renderApp();
    await openCase(user);
    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: 'Investigar Jardim' }));

    expect(screen.queryByText(/combina com todas/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Só .* combina/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /pista \d: ainda não sei/ })).toHaveLength(6);
  });

  it('trava as células quando o caso termina', async () => {
    const { user } = renderApp();
    await openCase(user);
    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: 'Acusar Ana' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));
    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: /^Bruno, pista 1/ })).toBeDisabled();
  });

  it('limpa o quadro ao jogar de novo', async () => {
    const { user } = renderApp();
    await openCase(user);
    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: /^Bruno, pista 1/ }));
    await user.click(screen.getByRole('button', { name: 'Acusar Ana' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));
    await user.click(screen.getByRole('button', { name: 'Jogar de novo' }));

    expect(screen.queryByRole('columnheader', { name: 'P1' })).not.toBeInTheDocument();
  });
});

describe('casos difíceis', () => {
  async function openRealCase(title: string) {
    const user = userEvent.setup();
    render(<App cases={allCases} progressStorage={createInMemoryProgress()} tutorialStorage={createInMemoryTutorial(true)} />);
    await user.click(screen.getByRole('button', { name: new RegExp(`Investigar.*${title}`) }));

    return user;
  }

  it('mostra seis traços no perfil do caso Difícil+', async () => {
    await openRealCase('Apagão na gala');

    expect(screen.getByText(/Acessório · Chegou de/)).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(9);
  });

  it('esconde o local de cada um no caso Mestre e explica a regra dos depoimentos', async () => {
    const user = await openRealCase('Sabotagem no teatro');

    expect(screen.getByText(/Mão dominante · Calçado · Bebida favorita$/)).toBeInTheDocument();
    expect(screen.queryByText(/Estava às 21h em/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Nos depoimentos, só o culpado mente/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Investigar Depoimento de Heitor' }));

    expect(screen.getByText(/Nos depoimentos, só o culpado mente/)).toBeInTheDocument();
    expect(screen.getByText(/Heitor diz: "A Marina não estava no camarim/)).toBeInTheDocument();
  });

  it('resolve o caso Mestre acusando quem contradiz os outros depoimentos', async () => {
    const user = await openRealCase('Sabotagem no teatro');

    for (const place of ['Depoimento de Otto', 'Depoimento de Neusa', 'Palco']) {
      await user.click(screen.getByRole('button', { name: `Investigar ${place}` }));
    }
    await user.click(screen.getByRole('button', { name: 'Acusar Otto' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));

    expect(screen.getByRole('dialog', { name: 'Caso resolvido' })).toBeInTheDocument();
  });

  it('explica a contradição quando a acusação é incompatível com os depoimentos', async () => {
    const user = await openRealCase('Sabotagem no teatro');

    for (const place of ['Depoimento de Otto', 'Depoimento de Neusa', 'Palco']) {
      await user.click(screen.getByRole('button', { name: `Investigar ${place}` }));
    }
    await user.click(screen.getByRole('button', { name: 'Acusar Neusa' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));

    expect(screen.getByRole('status')).toHaveTextContent(/Neusa é inocente\. As pistas já contradiziam essa acusação/);
  });
});

describe('fim do caso', () => {
  it('mostra o resultado, explica a solução e salva as estrelas ao acertar', async () => {
    const { user, progressStorage } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: 'Acusar Ana' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));

    const dialog = screen.getByRole('dialog', { name: 'Caso resolvido' });
    expect(within(dialog).getByRole('img', { name: '3 de 3 estrelas' })).toBeInTheDocument();
    expect(within(dialog).getByText('Mestre detetive')).toBeInTheDocument();
    expect(within(dialog).getByText(/Ana é a única canhota/)).toBeInTheDocument();
    expect(within(dialog).getByText('1 lugar investigado e 0 acusações erradas.')).toBeInTheDocument();
    expect(progressStorage.current()['test-case']).toMatchObject({ stars: 3, inspectedCount: 1 });
  });

  it('revela o culpado e não salva resultado ao esgotar as tentativas', async () => {
    const baseCase = buildCaseFile();
    const caseFile = {
      ...baseCase,
      suspects: [
        ...baseCase.suspects,
        { id: 'davi', name: 'Davi', role: 'Vizinho', traits: { hand: 'mão direita', shoes: 'tênis', drink: 'água', location: 'rua' } },
      ],
    };
    const { user, progressStorage } = renderApp({ caseFile });
    await openCase(user);

    for (const name of ['Bruno', 'Carla', 'Davi']) {
      await user.click(screen.getByRole('button', { name: `Acusar ${name}` }));
      await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));
    }

    const dialog = screen.getByRole('dialog', { name: 'O culpado escapou' });
    expect(within(dialog).getByText(/O culpado era Ana/)).toBeInTheDocument();
    expect(progressStorage.current()).toEqual({});
  });

  it('permite fechar o resultado, reabri-lo e jogar de novo do zero', async () => {
    const { user } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Investigar Escritório' }));
    await user.click(screen.getByRole('button', { name: 'Acusar Ana' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Investigar Jardim' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Acusar Bruno' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Ver resultado' }));
    await user.click(screen.getByRole('button', { name: 'Jogar de novo' }));

    expect(screen.getByText(/Lugares investigados:/)).toHaveTextContent('0 de 3');
    expect(screen.getByRole('button', { name: 'Investigar Escritório' })).toBeEnabled();
  });

  it('volta para a lista de casos mostrando a nova estrela', async () => {
    const { user } = renderApp();
    await openCase(user);

    await user.click(screen.getByRole('button', { name: 'Acusar Ana' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar acusação' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Voltar aos casos' }));

    expect(screen.getByRole('heading', { name: 'Escolha um caso' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '3 de 3 estrelas' })).toBeInTheDocument();
  });
});
