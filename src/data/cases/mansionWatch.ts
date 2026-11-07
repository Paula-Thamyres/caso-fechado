import type { CaseFile } from '../../domain/caseFile';

export const mansionWatch: CaseFile = {
  id: 'mansion-watch',
  title: 'O sumiço do relógio',
  traitKeys: ['hand', 'shoes', 'drink', 'location'],
  difficulty: 'easy',
  briefing:
    'O relógio de bolso da família Albuquerque desapareceu do cofre do escritório durante o jantar de sábado. Só quem estava na mansão àquela noite pode ter sido. Descubra quem levou.',
  culpritId: 'dora',
  suspects: [
    {
      id: 'marta',
      name: 'Marta',
      role: 'Governanta',
      traits: { hand: 'mão direita', shoes: 'tênis', drink: 'chá', location: 'sala' },
    },
    {
      id: 'rui',
      name: 'Rui',
      role: 'Jardineiro',
      traits: { hand: 'mão direita', shoes: 'bota', drink: 'café', location: 'jardim' },
    },
    {
      id: 'lia',
      name: 'Lia',
      role: 'Sobrinha',
      traits: { hand: 'mão esquerda', shoes: 'salto alto', drink: 'vinho', location: 'sala' },
    },
    {
      id: 'caio',
      name: 'Caio',
      role: 'Mordomo',
      traits: { hand: 'mão direita', shoes: 'sapato social', drink: 'chá', location: 'sala' },
    },
    {
      id: 'dora',
      name: 'Dora',
      role: 'Cozinheira',
      traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'café', location: 'cozinha' },
    },
  ],
  places: [
    {
      id: 'office',
      name: 'Escritório',
      scene: 'O cofre está entreaberto e a gaveta de baixo tem marcas de alavanca.',
      clue: {
        id: 'office-lever-marks',
        text: 'As marcas na gaveta são inclinadas para a direita: quem forçou a gaveta usa a mão esquerda.',
        effect: { kind: 'culprit', trait: 'hand', values: ['mão esquerda'], relation: 'has' },
      },
    },
    {
      id: 'garden',
      name: 'Jardim',
      scene: 'A porta lateral dá para um caminho de terra úmida logo depois da chuva.',
      clue: {
        id: 'garden-footprints',
        text: 'As pegadas na terra têm solado liso, de borracha macia, sem salto nem frisos de bota.',
        effect: { kind: 'culprit', trait: 'shoes', values: ['tênis'], relation: 'has' },
      },
    },
    {
      id: 'kitchen',
      name: 'Cozinha',
      scene: 'A bancada ainda está arrumada para o jantar. Há uma xícara fora do lugar, perto da porta dos fundos.',
      clue: {
        id: 'kitchen-cup',
        text: 'A xícara tem borra de café. Quem passou por ali tomou café, não chá nem vinho.',
        effect: { kind: 'culprit', trait: 'drink', values: ['café'], relation: 'has' },
      },
    },
    {
      id: 'library',
      name: 'Biblioteca',
      scene: 'Os livros estão no lugar e o ambiente cheira a madeira velha.',
      clue: {
        id: 'library-stopped-clock',
        text: 'O relógio de parede parou às 21h. É curioso, mas não aponta ninguém.',
        effect: null,
      },
    },
  ],
  explanation:
    'Só duas pessoas usam a mão esquerda: Lia e Dora. As pegadas de solado liso descartam Lia, que usava salto alto. A borra de café confirma Dora, que passou pela cozinha antes de chegar ao escritório.',
};
