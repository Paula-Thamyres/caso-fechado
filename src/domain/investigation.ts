import type { CaseFile, Clue, Place } from './caseFile';
import { MAXIMUM_WRONG_ACCUSATIONS } from './caseRules';
import { findContradictingClue } from './deduction';

export type DeductionMark = 'matches' | 'excludes';

export type InvestigationOutcome = 'in-progress' | 'solved' | 'failed';

export type AccusationVerdict =
  | { readonly kind: 'correct'; readonly accusedId: string }
  | {
      readonly kind: 'wrong';
      readonly accusedId: string;
      readonly contradictingClue: Clue | null;
      readonly remainingAttempts: number;
    };

export type InvestigationState = {
  readonly caseId: string;
  readonly inspectedPlaceIds: readonly string[];
  readonly eliminatedSuspectIds: readonly string[];
  readonly deductionMarks: Readonly<Record<string, DeductionMark>>;
  readonly wrongAccusationCount: number;
  readonly outcome: InvestigationOutcome;
  readonly lastVerdict: AccusationVerdict | null;
};

export type TransitionFailure =
  | 'investigation-finished'
  | 'place-unknown'
  | 'place-already-inspected'
  | 'suspect-unknown'
  | 'suspect-eliminated'
  | 'clue-not-discovered';

export type TransitionResult =
  | { readonly ok: true; readonly state: InvestigationState }
  | { readonly ok: false; readonly reason: TransitionFailure };

function succeed(state: InvestigationState): TransitionResult {
  return { ok: true, state };
}

function fail(reason: TransitionFailure): TransitionResult {
  return { ok: false, reason };
}

export function startInvestigation(caseFile: CaseFile): InvestigationState {
  return {
    caseId: caseFile.id,
    inspectedPlaceIds: [],
    eliminatedSuspectIds: [],
    deductionMarks: {},
    wrongAccusationCount: 0,
    outcome: 'in-progress',
    lastVerdict: null,
  };
}

export function deductionMarkKey(suspectId: string, clueId: string): string {
  return `${suspectId}:${clueId}`;
}

export function collectInspectedPlaces(caseFile: CaseFile, state: InvestigationState): readonly Place[] {
  return state.inspectedPlaceIds.flatMap((placeId) => {
    const place = caseFile.places.find((candidate) => candidate.id === placeId);

    return place ? [place] : [];
  });
}

export function collectDiscoveredClues(caseFile: CaseFile, state: InvestigationState): readonly Clue[] {
  return collectInspectedPlaces(caseFile, state).map((place) => place.clue);
}

export function remainingAttempts(state: InvestigationState): number {
  return MAXIMUM_WRONG_ACCUSATIONS - state.wrongAccusationCount;
}

export function inspectPlace(caseFile: CaseFile, state: InvestigationState, placeId: string): TransitionResult {
  if (state.outcome !== 'in-progress') {
    return fail('investigation-finished');
  }

  if (!caseFile.places.some((place) => place.id === placeId)) {
    return fail('place-unknown');
  }

  if (state.inspectedPlaceIds.includes(placeId)) {
    return fail('place-already-inspected');
  }

  return succeed({ ...state, inspectedPlaceIds: [...state.inspectedPlaceIds, placeId], lastVerdict: null });
}

export function toggleSuspectElimination(caseFile: CaseFile, state: InvestigationState, suspectId: string): TransitionResult {
  if (state.outcome !== 'in-progress') {
    return fail('investigation-finished');
  }

  if (!caseFile.suspects.some((suspect) => suspect.id === suspectId)) {
    return fail('suspect-unknown');
  }

  const isEliminated = state.eliminatedSuspectIds.includes(suspectId);
  const eliminatedSuspectIds = isEliminated
    ? state.eliminatedSuspectIds.filter((identifier) => identifier !== suspectId)
    : [...state.eliminatedSuspectIds, suspectId];

  return succeed({ ...state, eliminatedSuspectIds, lastVerdict: null });
}

const NEXT_MARK: Readonly<Record<'none' | DeductionMark, DeductionMark | null>> = {
  none: 'matches',
  matches: 'excludes',
  excludes: null,
};

export function cycleDeductionMark(
  caseFile: CaseFile,
  state: InvestigationState,
  suspectId: string,
  clueId: string,
): TransitionResult {
  if (state.outcome !== 'in-progress') {
    return fail('investigation-finished');
  }

  if (!caseFile.suspects.some((suspect) => suspect.id === suspectId)) {
    return fail('suspect-unknown');
  }

  if (!collectDiscoveredClues(caseFile, state).some((clue) => clue.id === clueId)) {
    return fail('clue-not-discovered');
  }

  const key = deductionMarkKey(suspectId, clueId);
  const nextMark = NEXT_MARK[state.deductionMarks[key] ?? 'none'];
  const { [key]: _previousMark, ...otherMarks } = state.deductionMarks;
  const deductionMarks = nextMark ? { ...otherMarks, [key]: nextMark } : otherMarks;

  return succeed({ ...state, deductionMarks, lastVerdict: null });
}

export function accuseSuspect(caseFile: CaseFile, state: InvestigationState, suspectId: string): TransitionResult {
  if (state.outcome !== 'in-progress') {
    return fail('investigation-finished');
  }

  const accused = caseFile.suspects.find((suspect) => suspect.id === suspectId);

  if (!accused) {
    return fail('suspect-unknown');
  }

  if (state.eliminatedSuspectIds.includes(suspectId)) {
    return fail('suspect-eliminated');
  }

  if (accused.id === caseFile.culpritId) {
    return succeed({ ...state, outcome: 'solved', lastVerdict: { kind: 'correct', accusedId: accused.id } });
  }

  const wrongAccusationCount = state.wrongAccusationCount + 1;
  const attemptsLeft = MAXIMUM_WRONG_ACCUSATIONS - wrongAccusationCount;

  return succeed({
    ...state,
    wrongAccusationCount,
    eliminatedSuspectIds: [...state.eliminatedSuspectIds, suspectId],
    outcome: attemptsLeft > 0 ? 'in-progress' : 'failed',
    lastVerdict: {
      kind: 'wrong',
      accusedId: accused.id,
      contradictingClue: findContradictingClue(caseFile, accused, collectDiscoveredClues(caseFile, state)),
      remainingAttempts: attemptsLeft,
    },
  });
}
