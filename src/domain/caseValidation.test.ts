import { describe, expect, it } from 'vitest';
import { allCases } from '../data/cases';
import { buildCaseFile } from '../testing/buildCaseFile';
import { validateCaseFile } from './caseValidation';
import { countMinimumClues } from './minimumClues';

function codesOf(caseFile: Parameters<typeof validateCaseFile>[0]) {
  return validateCaseFile(caseFile).map((issue) => issue.code);
}

describe('validateCaseFile', () => {
  it('aceita um caso bem montado', () => {
    expect(validateCaseFile(buildCaseFile())).toEqual([]);
  });

  it('recusa caso com poucos suspeitos', () => {
    const caseFile = buildCaseFile();

    expect(codesOf({ ...caseFile, suspects: caseFile.suspects.slice(0, 2) })).toContain('too-few-suspects');
  });

  it('recusa caso com poucos lugares', () => {
    const caseFile = buildCaseFile();

    expect(codesOf({ ...caseFile, places: caseFile.places.slice(0, 2) })).toContain('too-few-places');
  });

  it('recusa identificadores repetidos', () => {
    const caseFile = buildCaseFile();
    const [first, second, third] = caseFile.suspects;
    const [firstPlace, secondPlace, thirdPlace] = caseFile.places;

    expect(codesOf({ ...caseFile, suspects: [first!, { ...second!, id: first!.id }, third!] })).toContain('duplicate-suspect-id');
    expect(codesOf({ ...caseFile, places: [firstPlace!, { ...secondPlace!, id: firstPlace!.id }, thirdPlace!] })).toContain('duplicate-place-id');
    expect(
      codesOf({ ...caseFile, places: [firstPlace!, { ...secondPlace!, clue: { ...secondPlace!.clue, id: firstPlace!.clue.id } }, thirdPlace!] }),
    ).toContain('duplicate-clue-id');
  });

  it('recusa culpado que não existe', () => {
    expect(codesOf(buildCaseFile({ culpritId: 'ninguem' }))).toContain('culprit-missing');
  });

  it('recusa pista que cita um valor que nenhum suspeito tem', () => {
    const caseFile = buildCaseFile();
    const [firstPlace, ...otherPlaces] = caseFile.places;
    const brokenPlace = { ...firstPlace!, clue: { ...firstPlace!.clue, effect: { kind: 'culprit' as const, trait: 'hand' as const, values: ['ambidestro'], relation: 'has' as const } } };

    expect(codesOf({ ...caseFile, places: [brokenPlace, ...otherPlaces] })).toContain('clue-value-unknown');
  });

  it('recusa caso em que as pistas contradizem o culpado', () => {
    expect(codesOf(buildCaseFile({ culpritId: 'bruno' }))).toContain('culprit-contradicted');
  });

  it('recusa caso em que as pistas deixam mais de um suspeito', () => {
    const caseFile = buildCaseFile();
    const [firstPlace, , thirdPlace] = caseFile.places;
    const [, secondPlace] = caseFile.places;
    const neutralPlace = { ...secondPlace!, clue: { ...secondPlace!.clue, effect: null } };

    expect(codesOf({ ...caseFile, places: [firstPlace!, neutralPlace, thirdPlace!] })).toContain('ambiguous-solution');
  });
});

describe('validateCaseFile com depoimentos e traços escondidos', () => {
  function withEffect(effect: NonNullable<ReturnType<typeof buildCaseFile>['places'][number]['clue']['effect']>) {
    const caseFile = buildCaseFile();
    const [firstPlace, ...otherPlaces] = caseFile.places;

    return { ...caseFile, places: [{ ...firstPlace!, clue: { ...firstPlace!.clue, effect } }, ...otherPlaces] };
  }

  it('recusa suspeito sem um dos traços visíveis do caso', () => {
    const caseFile = buildCaseFile();
    const [first, ...others] = caseFile.suspects;

    expect(codesOf({ ...caseFile, suspects: [{ ...first!, traits: { hand: 'mão esquerda' } }, ...others] })).toContain('suspect-trait-missing');
  });

  it('recusa pista sobre o culpado que usa um traço escondido', () => {
    expect(
      codesOf(withEffect({ kind: 'culprit', trait: 'accessory', values: ['chapéu'], relation: 'has' })),
    ).toContain('clue-value-unknown');
    expect(
      codesOf({ ...withEffect({ kind: 'culprit', trait: 'location', values: ['cozinha'], relation: 'has' }), traitKeys: ['hand', 'shoes', 'drink'] }),
    ).toContain('clue-trait-hidden');
  });

  it('recusa depoimento de quem ou sobre quem não existe', () => {
    const effect = { kind: 'statement' as const, speakerId: 'fantasma', subjectId: 'bruno', trait: 'location' as const, values: ['sala'], relation: 'has' as const };

    expect(codesOf(withEffect(effect))).toContain('statement-person-unknown');
  });

  it('recusa depoimento que não segue a regra de que só o culpado mente', () => {
    const innocentLying = { kind: 'statement' as const, speakerId: 'bruno', subjectId: 'carla', trait: 'location' as const, values: ['jardim'], relation: 'has' as const };
    const culpritTelling = { kind: 'statement' as const, speakerId: 'ana', subjectId: 'carla', trait: 'location' as const, values: ['sala'], relation: 'has' as const };

    expect(codesOf(withEffect(innocentLying))).toContain('statement-contradicts-truth');
    expect(codesOf(withEffect(culpritTelling))).toContain('statement-contradicts-truth');
  });

  it('aceita depoimento verdadeiro de inocente e falso do culpado', () => {
    const innocentTelling = { kind: 'statement' as const, speakerId: 'bruno', subjectId: 'carla', trait: 'location' as const, values: ['sala'], relation: 'has' as const };
    const culpritLying = { kind: 'statement' as const, speakerId: 'ana', subjectId: 'carla', trait: 'location' as const, values: ['jardim'], relation: 'has' as const };

    expect(codesOf(withEffect(innocentTelling))).not.toContain('statement-contradicts-truth');
    expect(codesOf(withEffect(culpritLying))).not.toContain('statement-contradicts-truth');
  });
});

describe('casos do jogo', () => {
  it.each(allCases.map((caseFile) => [caseFile.id, caseFile] as const))('%s tem um único culpado possível', (_, caseFile) => {
    expect(validateCaseFile(caseFile)).toEqual([]);
  });

  it('usa identificadores de caso únicos', () => {
    const identifiers = allCases.map((caseFile) => caseFile.id);

    expect(new Set(identifiers).size).toBe(identifiers.length);
  });

  it('exige mais pistas combinadas nos casos mais difíceis', () => {
    const minimums = allCases.map((caseFile) => countMinimumClues(caseFile));

    expect(minimums).toEqual([2, 2, 3, 4, 3]);
  });
});
