import { describe, expect, it } from 'vitest';
import type { CaseFile, Clue, ClueEffect } from './caseFile';
import { buildCaseFile } from '../testing/buildCaseFile';
import { claimHolds, findContradictingClue, findPossibleCulprits, isPossibleCulprit } from './deduction';

function clueWith(id: string, effect: ClueEffect | null): Clue {
  return { id, text: id, effect };
}

const caseFile = buildCaseFile();
const [ana, bruno, carla] = caseFile.suspects as [(typeof caseFile.suspects)[0], (typeof caseFile.suspects)[0], (typeof caseFile.suspects)[0]];
const handClue = caseFile.places[0]!.clue;
const shoesClue = caseFile.places[1]!.clue;
const flavorClue = caseFile.places[2]!.clue;

describe('claimHolds', () => {
  it('trata a lista de valores como "um destes"', () => {
    const claim = { trait: 'shoes' as const, values: ['tênis', 'bota'], relation: 'has' as const };

    expect(claimHolds(claim, 'bota')).toBe(true);
    expect(claimHolds(claim, 'salto alto')).toBe(false);
    expect(claimHolds(claim, undefined)).toBe(false);
  });

  it('inverte o resultado quando a pista diz "não tem"', () => {
    const claim = { trait: 'shoes' as const, values: ['tênis', 'bota'], relation: 'lacks' as const };

    expect(claimHolds(claim, 'bota')).toBe(false);
    expect(claimHolds(claim, 'salto alto')).toBe(true);
  });
});

describe('isPossibleCulprit com pistas sobre o culpado', () => {
  it('aceita quem tem o traço quando a pista diz "tem"', () => {
    expect(isPossibleCulprit(caseFile, ana, [handClue])).toBe(true);
    expect(isPossibleCulprit(caseFile, bruno, [handClue])).toBe(false);
  });

  it('aceita quem não tem o traço quando a pista diz "não tem"', () => {
    expect(isPossibleCulprit(caseFile, ana, [shoesClue])).toBe(true);
    expect(isPossibleCulprit(caseFile, carla, [shoesClue])).toBe(false);
  });

  it('aceita todo mundo quando a pista não tem efeito', () => {
    expect([ana, bruno, carla].every((suspect) => isPossibleCulprit(caseFile, suspect, [flavorClue]))).toBe(true);
  });

  it('entende pistas com "ou"', () => {
    const eitherShoes = clueWith('either', { kind: 'culprit', trait: 'shoes', values: ['tênis', 'bota'], relation: 'has' });

    expect(findPossibleCulprits(caseFile, [eitherShoes]).map((suspect) => suspect.id)).toEqual(['ana', 'bruno']);
  });
});

describe('findPossibleCulprits', () => {
  it('devolve todos os suspeitos quando não há pistas', () => {
    expect(findPossibleCulprits(caseFile, [])).toHaveLength(3);
  });

  it('cruza as pistas e deixa só quem combina com todas', () => {
    expect(findPossibleCulprits(caseFile, [handClue, shoesClue])).toEqual([ana]);
  });
});

describe('depoimentos em que só o culpado mente', () => {
  const testimonyCase: CaseFile = buildCaseFile({
    traitKeys: ['hand', 'shoes', 'drink'],
    suspects: [
      { id: 'ana', name: 'Ana', role: 'A', traits: { hand: 'mão esquerda', shoes: 'tênis', drink: 'café', location: 'cozinha' } },
      { id: 'bruno', name: 'Bruno', role: 'B', traits: { hand: 'mão direita', shoes: 'bota', drink: 'café', location: 'jardim' } },
      { id: 'carla', name: 'Carla', role: 'C', traits: { hand: 'mão esquerda', shoes: 'salto alto', drink: 'chá', location: 'sala' } },
    ],
  });
  const [ana, bruno, carla] = testimonyCase.suspects as [(typeof testimonyCase.suspects)[0], (typeof testimonyCase.suspects)[0], (typeof testimonyCase.suspects)[0]];

  function statement(id: string, speakerId: string, subjectId: string, values: string[], relation: 'has' | 'lacks' = 'has') {
    return clueWith(id, { kind: 'statement', speakerId, subjectId, trait: 'location', values, relation });
  }

  it('aceita um depoimento isolado de qualquer suspeito, porque o valor escondido pode ser qualquer um', () => {
    const clues = [statement('s1', 'ana', 'bruno', ['jardim'])];

    expect(findPossibleCulprits(testimonyCase, clues)).toHaveLength(3);
  });

  it('aponta como culpado quem contradiz os outros depoimentos', () => {
    const clues = [statement('s1', 'ana', 'carla', ['sala']), statement('s2', 'bruno', 'carla', ['cozinha'])];

    expect(findPossibleCulprits(testimonyCase, clues).map((suspect) => suspect.id)).toEqual(['ana', 'bruno']);
  });

  it('exclui quem ficaria com duas versões incompatíveis dos inocentes', () => {
    const clues = [
      statement('s1', 'ana', 'carla', ['sala']),
      statement('s2', 'bruno', 'carla', ['cozinha']),
      statement('s3', 'carla', 'ana', ['cozinha']),
    ];

    expect(isPossibleCulprit(testimonyCase, carla, clues)).toBe(false);
    expect(isPossibleCulprit(testimonyCase, ana, clues)).toBe(true);
    expect(isPossibleCulprit(testimonyCase, bruno, clues)).toBe(true);
  });

  it('confere depoimentos sobre traços visíveis com o perfil real', () => {
    const visibleLie = clueWith('visible', { kind: 'statement', speakerId: 'ana', subjectId: 'bruno', trait: 'hand', values: ['mão esquerda'], relation: 'has' });

    expect(findPossibleCulprits(testimonyCase, [visibleLie]).map((suspect) => suspect.id)).toEqual(['ana']);
  });

  it('o culpado precisa que todos os seus depoimentos sejam falsos', () => {
    const clues = [statement('s1', 'ana', 'ana', ['cozinha'])];

    expect(isPossibleCulprit(testimonyCase, ana, clues)).toBe(true);
    expect(isPossibleCulprit(testimonyCase, bruno, clues)).toBe(true);
    expect(isPossibleCulprit(testimonyCase, ana, [...clues, statement('s2', 'ana', 'ana', ['sala', 'jardim'])])).toBe(false);
  });
});

describe('findContradictingClue', () => {
  it('devolve a primeira pista que torna a acusação impossível', () => {
    expect(findContradictingClue(caseFile, bruno, [flavorClue, handClue])).toBe(handClue);
  });

  it('devolve null quando nenhuma pista contradiz', () => {
    expect(findContradictingClue(caseFile, ana, [handClue, shoesClue, flavorClue])).toBeNull();
  });
});
