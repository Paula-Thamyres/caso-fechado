import type { CaseFile, Clue } from './caseFile';
import { combinations } from './combinations';
import { findPossibleCulprits } from './deduction';

function isolatesCulprit(caseFile: CaseFile, clues: readonly Clue[]): boolean {
  const compatibleSuspects = findPossibleCulprits(caseFile, clues);

  return compatibleSuspects.length === 1 && compatibleSuspects[0]?.id === caseFile.culpritId;
}

export function countMinimumClues(caseFile: CaseFile): number | null {
  const informativeClues = caseFile.places.map((place) => place.clue).filter((clue) => clue.effect !== null);

  for (let size = 1; size <= informativeClues.length; size += 1) {
    for (const selection of combinations(informativeClues, size)) {
      if (isolatesCulprit(caseFile, selection)) {
        return size;
      }
    }
  }

  return null;
}
