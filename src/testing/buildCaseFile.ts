import type { CaseFile } from '../domain/caseFile';

export function buildCaseFile(overrides: Partial<CaseFile> = {}): CaseFile {
  return {
    id: 'test-case',
    title: 'Caso de teste',
    briefing: 'Um caso para testar o jogo.',
    difficulty: 'easy',
    traitKeys: ['hand', 'shoes', 'drink', 'location'],
    culpritId: 'ana',
    suspects: [
      { id: 'ana', name: 'Ana', role: 'Cozinheira', traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'café', location: 'cozinha' } },
      { id: 'bruno', name: 'Bruno', role: 'Jardineiro', traits: { hand: 'mão direita', shoes: 'bota', drink: 'café', location: 'jardim' } },
      { id: 'carla', name: 'Carla', role: 'Sobrinha', traits: { hand: 'mão esquerda', shoes: 'salto alto', drink: 'chá', location: 'sala' } },
    ],
    places: [
      {
        id: 'office',
        name: 'Escritório',
        scene: 'Uma gaveta aberta.',
        clue: { id: 'office-clue', text: 'Quem abriu usa a mão esquerda.', effect: { kind: 'culprit', trait: 'hand', values: ['mão esquerda'], relation: 'has' } },
      },
      {
        id: 'garden',
        name: 'Jardim',
        scene: 'Terra úmida.',
        clue: { id: 'garden-clue', text: 'O ladrão não usava salto alto.', effect: { kind: 'culprit', trait: 'shoes', values: ['salto alto'], relation: 'lacks' } },
      },
      {
        id: 'library',
        name: 'Biblioteca',
        scene: 'Livros no lugar.',
        clue: { id: 'library-clue', text: 'O relógio parou às 21h.', effect: null },
      },
    ],
    explanation: 'Ana é a única canhota que não usa salto alto.',
    ...overrides,
  };
}
