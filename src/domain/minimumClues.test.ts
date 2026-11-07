import { describe, expect, it } from 'vitest';
import { buildCaseFile } from '../testing/buildCaseFile';
import { countMinimumClues } from './minimumClues';

describe('countMinimumClues', () => {
  it('encontra o menor número de pistas que isola o culpado', () => {
    expect(countMinimumClues(buildCaseFile())).toBe(2);
  });

  it('devolve 1 quando uma única pista basta', () => {
    const caseFile = buildCaseFile();
    const [firstPlace, ...otherPlaces] = caseFile.places;
    const decisivePlace = { ...firstPlace!, clue: { ...firstPlace!.clue, effect: { kind: 'culprit' as const, trait: 'shoes' as const, values: ['tênis'], relation: 'has' as const } } };

    expect(countMinimumClues({ ...caseFile, places: [decisivePlace, ...otherPlaces] })).toBe(1);
  });

  it('devolve null quando nenhuma combinação isola o culpado', () => {
    expect(countMinimumClues(buildCaseFile({ culpritId: 'bruno' }))).toBeNull();
  });
});
