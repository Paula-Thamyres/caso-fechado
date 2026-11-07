import type { CaseFile } from '../../domain/caseFile';

export const poisonedDinner: CaseFile = {
  id: 'poisoned-dinner',
  title: 'Veneno no jantar',
  traitKeys: ['hand', 'shoes', 'drink', 'location'],
  difficulty: 'medium',
  briefing:
    'Durante o jantar de aniversário do empresário Álvaro, a sopa dele foi envenenada. Ele passa bem, mas ninguém assume nada. Quem tinha acesso ao prato, e por quê, é o que você precisa descobrir.',
  culpritId: 'gustavo',
  suspects: [
    {
      id: 'helena',
      name: 'Helena',
      role: 'Sócia',
      traits: { hand: 'mão direita', shoes: 'salto alto', drink: 'vinho', location: 'sala' },
    },
    {
      id: 'otavio',
      name: 'Otávio',
      role: 'Contador',
      traits: { hand: 'mão direita', shoes: 'sapato social', drink: 'café', location: 'cozinha' },
    },
    {
      id: 'beatriz',
      name: 'Beatriz',
      role: 'Nutricionista',
      traits: { hand: 'mão esquerda', shoes: 'salto alto', drink: 'chá', location: 'jardim' },
    },
    {
      id: 'fabio',
      name: 'Fábio',
      role: 'Motorista',
      traits: { hand: 'mão direita', shoes: 'bota', drink: 'vinho', location: 'cozinha' },
    },
    {
      id: 'gustavo',
      name: 'Gustavo',
      role: 'Sobrinho',
      traits: { hand: 'mão esquerda', shoes: 'sapato social', drink: 'água', location: 'sala' },
    },
  ],
  places: [
    {
      id: 'kitchen',
      name: 'Cozinha',
      scene: 'A taça de vinho do anfitrião foi lavada, mas o frasco vazio está atrás do forno.',
      clue: {
        id: 'kitchen-wine-bottle',
        text: 'O frasco tem restos de vinho tinto. Quem envenenou não bebe vinho: teria sentido o gosto da mistura.',
        effect: { kind: 'culprit', trait: 'drink', values: ['vinho'], relation: 'lacks' },
      },
    },
    {
      id: 'dining-room',
      name: 'Sala de jantar',
      scene: 'O tapete tem marcas fundas perto da cadeira do anfitrião. A câmera da sala registrou o movimento.',
      clue: {
        id: 'dining-room-camera',
        text: 'A gravação mostra o envenenador sem salto alto: o piso de madeira não fez o barulho típico.',
        effect: { kind: 'culprit', trait: 'shoes', values: ['salto alto'], relation: 'lacks' },
      },
    },
    {
      id: 'garden',
      name: 'Jardim',
      scene: 'Da janela da sala, o jardim tem boa vista para a mesa do jantar.',
      clue: {
        id: 'garden-window-witness',
        text: 'Uma testemunha viu o envenenador de pé na sala às 21h, sem se mexer por longos minutos.',
        effect: { kind: 'culprit', trait: 'location', values: ['sala'], relation: 'has' },
      },
    },
    {
      id: 'office',
      name: 'Escritório',
      scene: 'Na mesa do anfitrião há um bilhete rasgado e um frasco de remédio sem tampa.',
      clue: {
        id: 'office-torn-note',
        text: 'A tampa foi desrosqueada com a mão esquerda: o sentido das marcas no vidro não deixa dúvida.',
        effect: { kind: 'culprit', trait: 'hand', values: ['mão esquerda'], relation: 'has' },
      },
    },
    {
      id: 'veranda',
      name: 'Varanda',
      scene: 'Uma taça de água mineral ficou esquecida na mesinha de canto.',
      clue: {
        id: 'veranda-untouched-glass',
        text: 'O copo está intocado e limpo. Foi um descuido do garçom, nada além disso.',
        effect: null,
      },
    },
  ],
  explanation:
    'Quem envenenou não bebe vinho e não usava salto alto, o que deixa Otávio e Gustavo. A testemunha o viu na sala, e Otávio estava na cozinha. A marca da tampa, aberta com a mão esquerda, também aponta Gustavo.',
};
