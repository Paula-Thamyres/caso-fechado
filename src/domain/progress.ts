import type { CaseFile } from './caseFile';
import type { InvestigationState } from './investigation';
import { countMinimumClues } from './minimumClues';
import { calculateStars } from './scoring';

export type CaseResult = {
  readonly caseId: string;
  readonly stars: number;
  readonly inspectedCount: number;
  readonly wrongAccusationCount: number;
};

export type ProgressByCase = Readonly<Record<string, CaseResult>>;

export function buildCaseResult(caseFile: CaseFile, state: InvestigationState): CaseResult | null {
  if (state.outcome !== 'solved') {
    return null;
  }

  const inspectedCount = state.inspectedPlaceIds.length;
  const stars = calculateStars({
    inspectedCount,
    totalPlaces: caseFile.places.length,
    minimumClues: countMinimumClues(caseFile) ?? caseFile.places.length,
    wrongAccusationCount: state.wrongAccusationCount,
  });

  return { caseId: caseFile.id, stars, inspectedCount, wrongAccusationCount: state.wrongAccusationCount };
}

export function isBetterResult(candidate: CaseResult, current: CaseResult): boolean {
  if (candidate.stars !== current.stars) {
    return candidate.stars > current.stars;
  }

  return candidate.inspectedCount < current.inspectedCount;
}

export function mergeResult(progress: ProgressByCase, result: CaseResult): ProgressByCase {
  const current = progress[result.caseId];

  return current && !isBetterResult(result, current) ? progress : { ...progress, [result.caseId]: result };
}
