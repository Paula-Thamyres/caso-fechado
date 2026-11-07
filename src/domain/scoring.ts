import { MAXIMUM_STARS, MINIMUM_STARS } from './caseRules';

export type ScoringInput = {
  readonly inspectedCount: number;
  readonly totalPlaces: number;
  readonly minimumClues: number;
  readonly wrongAccusationCount: number;
};

export function allowedInspections(totalPlaces: number, minimumClues: number): number {
  return minimumClues + Math.floor((totalPlaces - minimumClues) / 2);
}

export function calculateStars(input: ScoringInput): number {
  const penaltyForMistakes = input.wrongAccusationCount;
  const penaltyForWaste = input.inspectedCount > allowedInspections(input.totalPlaces, input.minimumClues) ? 1 : 0;

  return Math.max(MINIMUM_STARS, MAXIMUM_STARS - penaltyForMistakes - penaltyForWaste);
}
