import type { CaseFile } from '../../domain/caseFile';

export const museumTheft: CaseFile = {
  id: 'museum-theft',
  title: 'Roubo no museu',
  traitKeys: ['hand', 'shoes', 'drink', 'location'],
  difficulty: 'hard',
  briefing:
    'Na noite da exposição, uma estatueta de jade sumiu da sala principal do Museu Horizonte, mesmo com os alarmes ligados. Seis pessoas tinham acesso ao prédio. Nenhuma pista sozinha resolve o caso: é preciso cruzar as informações.',
  culpritId: 'murilo',
  suspects: [
    {
      id: 'iris',
      name: 'Íris',
      role: 'Curadora',
      traits: { hand: 'mão direita', shoes: 'tênis', drink: 'café', location: 'galeria' },
    },
    {
      id: 'nelson',
      name: 'Nelson',
      role: 'Segurança',
      traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'chá', location: 'galeria' },
    },
    {
      id: 'vera',
      name: 'Vera',
      role: 'Recepcionista',
      traits: { hand: 'mão direita', shoes: 'salto alto', drink: 'café', location: 'recepção' },
    },
    {
      id: 'teo',
      name: 'Téo',
      role: 'Restaurador',
      traits: { hand: 'mão esquerda', shoes: 'sapato social', drink: 'café', location: 'depósito' },
    },
    {
      id: 'cintia',
      name: 'Cíntia',
      role: 'Guia',
      traits: { hand: 'mão direita', shoes: 'tênis', drink: 'chá', location: 'depósito' },
    },
    {
      id: 'murilo',
      name: 'Murilo',
      role: 'Eletricista',
      traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'café', location: 'recepção' },
    },
  ],
  places: [
    {
      id: 'main-room',
      name: 'Sala principal',
      scene: 'O pedestal está vazio e há uma mancha de poeira no piso, bem em frente.',
      clue: {
        id: 'main-room-dust',
        text: 'A mancha tem a marca de um solado de borracha, sem salto: o ladrão usava tênis.',
        effect: { kind: 'culprit', trait: 'shoes', values: ['tênis'], relation: 'has' },
      },
    },
    {
      id: 'security-room',
      name: 'Sala de segurança',
      scene: 'Os monitores mostram as câmeras, mas a gravação das 21h tem poucos segundos de falha.',
      clue: {
        id: 'security-room-recording',
        text: 'No vídeo, o ladrão pega a estatueta com a mão esquerda e segura o celular com a direita.',
        effect: { kind: 'culprit', trait: 'hand', values: ['mão esquerda'], relation: 'has' },
      },
    },
    {
      id: 'cafeteria',
      name: 'Cafeteria',
      scene: 'A máquina de café foi usada pouco antes do roubo, e o registro mostra os pedidos.',
      clue: {
        id: 'cafeteria-order-log',
        text: 'O único pedido sem chá naquele horário foi um café preto. O ladrão estava acordado e agitado.',
        effect: { kind: 'culprit', trait: 'drink', values: ['café'], relation: 'has' },
      },
    },
    {
      id: 'gallery',
      name: 'Galeria leste',
      scene: 'A porta da galeria tem um sensor de presença que registra a movimentação.',
      clue: {
        id: 'gallery-sensor',
        text: 'O sensor não detectou ninguém lá durante a hora do roubo: o ladrão não estava na galeria.',
        effect: { kind: 'culprit', trait: 'location', values: ['galeria'], relation: 'lacks' },
      },
    },
    {
      id: 'storage',
      name: 'Depósito',
      scene: 'O depósito guarda as peças em restauro e tem uma entrada só.',
      clue: {
        id: 'storage-lock-log',
        text: 'A fechadura eletrônica mostra que ninguém entrou no depósito naquela hora.',
        effect: { kind: 'culprit', trait: 'location', values: ['depósito'], relation: 'lacks' },
      },
    },
    {
      id: 'reception',
      name: 'Recepção',
      scene: 'A lista de convidados está sobre o balcão, com algumas anotações a lápis.',
      clue: {
        id: 'reception-guest-list',
        text: 'A lista mostra que o museu recebeu 214 convidados naquela noite. Interessante, mas não ajuda.',
        effect: null,
      },
    },
  ],
  explanation:
    'Nenhuma pista isolada resolve. O tênis, a mão esquerda e o café ainda deixam Murilo e Téo ou Íris. Cruzando com os lugares onde o ladrão não estava, a galeria e o depósito, só Murilo, que ficou na recepção, combina com tudo.',
};
