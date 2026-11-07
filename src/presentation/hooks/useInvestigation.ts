import { useMemo, useState } from 'react';
import type { CaseFile, Clue, Place } from '../../domain/caseFile';
import {
  accuseSuspect,
  collectInspectedPlaces,
  cycleDeductionMark,
  inspectPlace,
  startInvestigation,
  toggleSuspectElimination,
  type InvestigationState,
  type TransitionResult,
} from '../../domain/investigation';
import { TRANSITION_MESSAGES } from '../formatters/transitionMessages';

export type InvestigationActions = {
  readonly state: InvestigationState;
  readonly inspectedPlaces: readonly Place[];
  readonly discoveredClues: readonly Clue[];
  readonly notice: string | null;
  inspect(placeId: string): void;
  toggleElimination(suspectId: string): void;
  cycleMark(suspectId: string, clueId: string): void;
  accuse(suspectId: string): void;
};

export function useInvestigation(caseFile: CaseFile): InvestigationActions {
  const [state, setState] = useState(() => startInvestigation(caseFile));
  const [notice, setNotice] = useState<string | null>(null);

  const inspectedPlaces = useMemo(() => collectInspectedPlaces(caseFile, state), [caseFile, state]);
  const discoveredClues = useMemo(() => inspectedPlaces.map((place) => place.clue), [inspectedPlaces]);

  function apply(result: TransitionResult) {
    if (result.ok) {
      setState(result.state);
      setNotice(null);
      return;
    }

    setNotice(TRANSITION_MESSAGES[result.reason]);
  }

  return {
    state,
    inspectedPlaces,
    discoveredClues,
    notice,
    inspect: (placeId) => apply(inspectPlace(caseFile, state, placeId)),
    toggleElimination: (suspectId) => apply(toggleSuspectElimination(caseFile, state, suspectId)),
    cycleMark: (suspectId, clueId) => apply(cycleDeductionMark(caseFile, state, suspectId, clueId)),
    accuse: (suspectId) => apply(accuseSuspect(caseFile, state, suspectId)),
  };
}
