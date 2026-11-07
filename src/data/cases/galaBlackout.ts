import type { CaseFile } from '../../domain/caseFile';

export const galaBlackout: CaseFile = {
  id: 'gala-blackout',
  title: 'Apagão na gala',
  difficulty: 'expert',
  traitKeys: ['hand', 'shoes', 'drink', 'location', 'accessory', 'transport'],
  briefing:
    'Durante a gala de inauguração do Hotel Aurora, as luzes se apagaram por um minuto e o colar de safiras da anfitriã sumiu da vitrine. Oito pessoas circulavam pelo salão. Aqui as pistas nem sempre apontam uma coisa só: algumas dizem "uma coisa ou outra" e outras dizem o que o ladrão não tem. Só dá para chegar ao culpado cruzando várias delas.',
  culpritId: 'fausto',
  suspects: [
    {
      id: 'alicia',
      name: 'Alícia',
      role: 'Anfitriã',
      traits: { hand: 'mão esquerda', shoes: 'sapato social', drink: 'água', location: 'terraço', accessory: 'chapéu', transport: 'carro' },
    },
    {
      id: 'bianca',
      name: 'Bianca',
      role: 'Cantora',
      traits: { hand: 'mão direita', shoes: 'salto alto', drink: 'café', location: 'terraço', accessory: 'relógio', transport: 'bicicleta' },
    },
    {
      id: 'caio',
      name: 'Caio',
      role: 'Garçom',
      traits: { hand: 'mão direita', shoes: 'sapato social', drink: 'café', location: 'salão', accessory: 'chapéu', transport: 'bicicleta' },
    },
    {
      id: 'dora',
      name: 'Dora',
      role: 'Fotógrafa',
      traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'água', location: 'galeria', accessory: 'luvas', transport: 'bicicleta' },
    },
    {
      id: 'fausto',
      name: 'Fausto',
      role: 'Técnico de luz',
      traits: { hand: 'mão esquerda', shoes: 'sapato social', drink: 'água', location: 'salão', accessory: 'chapéu', transport: 'bicicleta' },
    },
    {
      id: 'gisele',
      name: 'Gisele',
      role: 'Crítica de arte',
      traits: { hand: 'mão direita', shoes: 'salto alto', drink: 'chá', location: 'terraço', accessory: 'relógio', transport: 'bicicleta' },
    },
    {
      id: 'helena',
      name: 'Helena',
      role: 'Chef',
      traits: { hand: 'mão esquerda', shoes: 'salto alto', drink: 'chá', location: 'cozinha', accessory: 'chapéu', transport: 'bicicleta' },
    },
    {
      id: 'igor',
      name: 'Igor',
      role: 'Sommelier',
      traits: { hand: 'mão direita', shoes: 'tênis', drink: 'vinho', location: 'cozinha', accessory: 'luvas', transport: 'ônibus' },
    },
  ],
  places: [
    {
      id: 'security-room',
      name: 'Sala de segurança',
      scene: 'As câmeras gravaram o corredor durante o apagão, em imagem de baixa luz.',
      clue: {
        id: 'security-room-footwear',
        text: 'Na gravação, o ladrão usa calçado fechado e baixo: sapato social ou tênis. Salto, nem pensar.',
        effect: { kind: 'culprit', trait: 'shoes', values: ['sapato social', 'tênis'], relation: 'has' },
      },
    },
    {
      id: 'showcase',
      name: 'Vitrine',
      scene: 'O vidro foi aberto com cuidado, sem estilhaços, e a base de veludo ficou marcada.',
      clue: {
        id: 'showcase-felt-fiber',
        text: 'Um fio de feltro ficou preso na borda da vitrine: o ladrão usava chapéu.',
        effect: { kind: 'culprit', trait: 'accessory', values: ['chapéu'], relation: 'has' },
      },
    },
    {
      id: 'parking-lot',
      name: 'Estacionamento',
      scene: 'O manobrista anota quem chega e quem sai, com a placa dos carros.',
      clue: {
        id: 'parking-lot-valet',
        text: 'O manobrista garante que o ladrão não chegou de carro: nenhum carro ficou sem dono naquela noite.',
        effect: { kind: 'culprit', trait: 'transport', values: ['carro'], relation: 'lacks' },
      },
    },
    {
      id: 'terrace',
      name: 'Terraço',
      scene: 'Há um sensor de presença na porta de vidro, e as cadeiras estão todas no lugar.',
      clue: {
        id: 'terrace-sensor',
        text: 'O sensor não registrou ninguém no terraço na hora do apagão: o ladrão não estava lá.',
        effect: { kind: 'culprit', trait: 'location', values: ['terraço'], relation: 'lacks' },
      },
    },
    {
      id: 'bar',
      name: 'Bar',
      scene: 'Um copo foi deixado perto da vitrine e o garçom o trouxe de volta para o balcão.',
      clue: {
        id: 'bar-glass',
        text: 'O garçom lembra o conteúdo do copo: água ou chá. Nem café, nem vinho.',
        effect: { kind: 'culprit', trait: 'drink', values: ['água', 'chá'], relation: 'has' },
      },
    },
    {
      id: 'dressing-room',
      name: 'Camarim',
      scene: 'Um espelho grande reflete o corredor dos fundos, onde o ladrão passou.',
      clue: {
        id: 'dressing-room-mirror',
        text: 'No reflexo, o pulso do ladrão está nu e o rosto não brilha: sem relógio e sem óculos.',
        effect: { kind: 'culprit', trait: 'accessory', values: ['óculos', 'relógio'], relation: 'lacks' },
      },
    },
    {
      id: 'power-panel',
      name: 'Quadro de luz',
      scene: 'A chave geral foi desligada à mão, por alguns segundos, e religada em seguida.',
      clue: {
        id: 'power-panel-switch',
        text: 'A chave foi desligada às 21h em ponto. É importante para a linha do tempo, mas não aponta ninguém.',
        effect: null,
      },
    },
    {
      id: 'kitchen',
      name: 'Cozinha',
      scene: 'A equipe estava reunida em volta do fogão quando as luzes se apagaram.',
      clue: {
        id: 'kitchen-staff-shouting',
        text: 'A equipe da cozinha ouviu a gritaria do salão, mas ninguém saiu de lá. Curioso, nada além disso.',
        effect: null,
      },
    },
  ],
  explanation:
    'O calçado fechado e baixo deixa Alícia, Caio, Dora, Fausto e Igor. O chapéu fica com Alícia, Caio e Fausto. Como o ladrão não veio de carro, Alícia sai. Entre Caio e Fausto, o copo de água ou chá combina com Fausto, que bebe água. Caio toma café.',
};
