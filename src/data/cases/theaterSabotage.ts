import type { CaseFile } from '../../domain/caseFile';

export const theaterSabotage: CaseFile = {
  id: 'theater-sabotage',
  title: 'Sabotagem no teatro',
  difficulty: 'master',
  traitKeys: ['hand', 'shoes', 'drink'],
  briefing:
    'Na estreia do Teatro Aurora, o contrapeso do cenário caiu a centímetros da atriz principal. Foi sabotagem. Aqui as pistas são depoimentos, e só o culpado mente: todos os inocentes dizem a verdade. Onde cada um estava às 21h não aparece nas fichas, só nos depoimentos. Procure quem se contradiz.',
  culpritId: 'otto',
  suspects: [
    {
      id: 'marina',
      name: 'Marina',
      role: 'Atriz',
      traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'vinho', location: 'bastidores' },
    },
    {
      id: 'otto',
      name: 'Otto',
      role: 'Cenógrafo',
      traits: { hand: 'mão direita', shoes: 'tênis', drink: 'chá', location: 'bastidores' },
    },
    {
      id: 'caetano',
      name: 'Caetano',
      role: 'Diretor',
      traits: { hand: 'mão direita', shoes: 'sapato social', drink: 'café', location: 'plateia' },
    },
    {
      id: 'lucia',
      name: 'Lúcia',
      role: 'Figurinista',
      traits: { hand: 'mão direita', shoes: 'tênis', drink: 'vinho', location: 'bastidores' },
    },
    {
      id: 'heitor',
      name: 'Heitor',
      role: 'Iluminador',
      traits: { hand: 'mão esquerda', shoes: 'sapato social', drink: 'chá', location: 'plateia' },
    },
    {
      id: 'neusa',
      name: 'Neusa',
      role: 'Produtora',
      traits: { hand: 'mão direita', shoes: 'salto alto', drink: 'chá', location: 'bastidores' },
    },
  ],
  places: [
    {
      id: 'statement-heitor',
      name: 'Depoimento de Heitor',
      scene: 'O iluminador fala de braços cruzados, ainda de fone no pescoço.',
      clue: {
        id: 'statement-heitor-clue',
        text: 'Heitor diz: "A Marina não estava no camarim às 21h."',
        effect: { kind: 'statement', speakerId: 'heitor', subjectId: 'marina', trait: 'location', values: ['camarim'], relation: 'lacks' },
      },
    },
    {
      id: 'statement-caetano',
      name: 'Depoimento de Caetano',
      scene: 'O diretor responde rápido, como quem já ensaiou a resposta.',
      clue: {
        id: 'statement-caetano-clue',
        text: 'Caetano diz: "O Otto estava nos bastidores às 21h."',
        effect: { kind: 'statement', speakerId: 'caetano', subjectId: 'otto', trait: 'location', values: ['bastidores'], relation: 'has' },
      },
    },
    {
      id: 'statement-otto',
      name: 'Depoimento de Otto',
      scene: 'O cenógrafo fala sem olhar para os lados, com a mão suja de tinta.',
      clue: {
        id: 'statement-otto-clue',
        text: 'Otto diz: "O Heitor estava nos bastidores às 21h."',
        effect: { kind: 'statement', speakerId: 'otto', subjectId: 'heitor', trait: 'location', values: ['bastidores'], relation: 'has' },
      },
    },
    {
      id: 'statement-lucia',
      name: 'Depoimento de Lúcia',
      scene: 'A figurinista fala enquanto dobra um figurino, sem pressa.',
      clue: {
        id: 'statement-lucia-clue',
        text: 'Lúcia diz: "A Marina não estava na plateia às 21h."',
        effect: { kind: 'statement', speakerId: 'lucia', subjectId: 'marina', trait: 'location', values: ['plateia'], relation: 'lacks' },
      },
    },
    {
      id: 'statement-marina',
      name: 'Depoimento de Marina',
      scene: 'A atriz ainda está abalada, mas responde com clareza.',
      clue: {
        id: 'statement-marina-clue',
        text: 'Marina diz: "O Caetano não estava no camarim às 21h."',
        effect: { kind: 'statement', speakerId: 'marina', subjectId: 'caetano', trait: 'location', values: ['camarim'], relation: 'lacks' },
      },
    },
    {
      id: 'statement-neusa',
      name: 'Depoimento de Neusa',
      scene: 'A produtora fala ao telefone e interrompe a ligação só para responder.',
      clue: {
        id: 'statement-neusa-clue',
        text: 'Neusa diz: "O Heitor estava na plateia às 21h."',
        effect: { kind: 'statement', speakerId: 'neusa', subjectId: 'heitor', trait: 'location', values: ['plateia'], relation: 'has' },
      },
    },
    {
      id: 'stage',
      name: 'Palco',
      scene: 'O contrapeso ainda está no chão, e há marcas de solado no pó do tablado.',
      clue: {
        id: 'stage-footprints',
        text: 'As marcas no pó são de solado liso e de borracha: o sabotador usava tênis.',
        effect: { kind: 'culprit', trait: 'shoes', values: ['tênis'], relation: 'has' },
      },
    },
    {
      id: 'box-office',
      name: 'Bilheteria',
      scene: 'A fila da estreia ainda está lá, e o caixa conta os ingressos.',
      clue: {
        id: 'box-office-count',
        text: 'Foram vendidos 312 ingressos para a estreia. Bom para o teatro, mas não ajuda no caso.',
        effect: null,
      },
    },
  ],
  explanation:
    'Otto disse que Heitor estava nos bastidores, e Neusa disse que Heitor estava na plateia. Um dos dois mentiu, então o culpado é Otto ou Neusa. As marcas no palco são de tênis, e Neusa usava salto alto. Sobra Otto.',
};
