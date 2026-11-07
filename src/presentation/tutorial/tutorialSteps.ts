export type TutorialStep = {
  readonly title: string;
  readonly description: string;
  readonly example: string;
};

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    title: 'Seu objetivo',
    description:
      'Cada caso tem um único culpado entre os suspeitos. Você descobre quem é investigando lugares e comparando as pistas com o perfil de cada pessoa.',
    example: 'Resolva o caso gastando poucas investigações e sem acusar ninguém errado para ganhar mais estrelas.',
  },
  {
    title: 'Investigue os lugares',
    description:
      'Cada lugar guarda uma pista. Clique em "Investigar" para revelar o que há ali. A pista aparece e fica guardada no caderno de pistas.',
    example: 'Clicar em "Escritório" pode mostrar: "As marcas na gaveta indicam alguém que usa a mão esquerda."',
  },
  {
    title: 'Compare com os perfis',
    description:
      'Todo suspeito tem um perfil: mão dominante, calçado, bebida favorita e onde estava às 21h. Uma pista elimina quem não combina com ela. Algumas pistas dizem o que o culpado tem, outras o que ele não tem.',
    example: 'A pista pede "mão esquerda"? Quem usa a mão direita não pode ser o culpado.',
  },
  {
    title: 'Preencha o quadro de dedução',
    description:
      'Cada pista nova ganha uma coluna no quadro. Clique na célula para marcar: ? ainda não sei, ✓ combina com a pista, ✗ não combina. Quem você já eliminou pode ser marcado como descartado. O jogo não corrige suas marcas: a dedução é sua. Nem toda pista leva a alguém, algumas são só curiosidades.',
    example: 'A pista 1 diz "mão esquerda"? Marque ✗ em quem usa a mão direita e ✓ em quem usa a esquerda.',
  },
  {
    title: 'Pistas com "ou" e depoimentos',
    description:
      'Nos casos mais difíceis, uma pista pode deixar duas opções abertas ("tênis ou bota") ou dizer o que o culpado não tem. Nos casos mestres, as pistas são depoimentos: só o culpado mente. Procure dois depoimentos que se contradizem, porque um dos dois está mentindo.',
    example: 'Um diz "Heitor estava nos bastidores" e outro diz "Heitor estava na plateia"? O culpado é um desses dois.',
  },
  {
    title: 'Faça a acusação',
    description:
      'Quando tiver certeza, clique em "Acusar". Você tem 3 tentativas erradas. Se errar, o jogo mostra qual pista contradizia aquela acusação, e a pessoa sai da lista.',
    example: 'Acertou? Você ganha de 1 a 3 estrelas pelo número de erros e de lugares investigados.',
  },
];
