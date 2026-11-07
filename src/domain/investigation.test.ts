import { describe, expect, it } from 'vitest';
import { buildCaseFile } from '../testing/buildCaseFile';
import {
  accuseSuspect,
  collectDiscoveredClues,
  collectInspectedPlaces,
  cycleDeductionMark,
  deductionMarkKey,
  inspectPlace,
  remainingAttempts,
  startInvestigation,
  toggleSuspectElimination,
  type InvestigationState,
} from './investigation';

const caseFile = buildCaseFile();

function expectState(result: ReturnType<typeof inspectPlace>): InvestigationState {
  if (!result.ok) {
    throw new Error(`Transição recusada: ${result.reason}`);
  }

  return result.state;
}

describe('startInvestigation', () => {
  it('começa sem lugares, sem descartes e com todas as tentativas', () => {
    const state = startInvestigation(caseFile);

    expect(state).toMatchObject({ caseId: 'test-case', inspectedPlaceIds: [], eliminatedSuspectIds: [], outcome: 'in-progress' });
    expect(remainingAttempts(state)).toBe(3);
  });
});

describe('inspectPlace', () => {
  it('revela a pista do lugar e guarda a ordem das descobertas', () => {
    const afterGarden = expectState(inspectPlace(caseFile, startInvestigation(caseFile), 'garden'));
    const afterOffice = expectState(inspectPlace(caseFile, afterGarden, 'office'));

    expect(collectDiscoveredClues(caseFile, afterOffice).map((clue) => clue.id)).toEqual(['garden-clue', 'office-clue']);
  });

  it('recusa lugar desconhecido e lugar já investigado', () => {
    const state = expectState(inspectPlace(caseFile, startInvestigation(caseFile), 'office'));

    expect(inspectPlace(caseFile, state, 'cave')).toEqual({ ok: false, reason: 'place-unknown' });
    expect(inspectPlace(caseFile, state, 'office')).toEqual({ ok: false, reason: 'place-already-inspected' });
  });
});

describe('toggleSuspectElimination', () => {
  it('descarta e volta a suspeitar', () => {
    const discarded = expectState(toggleSuspectElimination(caseFile, startInvestigation(caseFile), 'bruno'));
    const restored = expectState(toggleSuspectElimination(caseFile, discarded, 'bruno'));

    expect(discarded.eliminatedSuspectIds).toEqual(['bruno']);
    expect(restored.eliminatedSuspectIds).toEqual([]);
  });

  it('recusa suspeito desconhecido', () => {
    expect(toggleSuspectElimination(caseFile, startInvestigation(caseFile), 'fantasma')).toEqual({ ok: false, reason: 'suspect-unknown' });
  });
});

describe('collectInspectedPlaces', () => {
  it('devolve os lugares na ordem em que foram investigados', () => {
    const afterGarden = expectState(inspectPlace(caseFile, startInvestigation(caseFile), 'garden'));
    const afterOffice = expectState(inspectPlace(caseFile, afterGarden, 'office'));

    expect(collectInspectedPlaces(caseFile, afterOffice).map((place) => place.id)).toEqual(['garden', 'office']);
  });
});

describe('cycleDeductionMark', () => {
  const inspected = expectState(inspectPlace(caseFile, startInvestigation(caseFile), 'office'));
  const key = deductionMarkKey('bruno', 'office-clue');

  it('percorre combina, não combina e volta a "não sei"', () => {
    const matches = expectState(cycleDeductionMark(caseFile, inspected, 'bruno', 'office-clue'));
    const excludes = expectState(cycleDeductionMark(caseFile, matches, 'bruno', 'office-clue'));
    const unknown = expectState(cycleDeductionMark(caseFile, excludes, 'bruno', 'office-clue'));

    expect(matches.deductionMarks[key]).toBe('matches');
    expect(excludes.deductionMarks[key]).toBe('excludes');
    expect(unknown.deductionMarks).toEqual({});
  });

  it('marca cada célula de forma independente', () => {
    const first = expectState(cycleDeductionMark(caseFile, inspected, 'bruno', 'office-clue'));
    const second = expectState(cycleDeductionMark(caseFile, first, 'carla', 'office-clue'));

    expect(Object.keys(second.deductionMarks)).toHaveLength(2);
  });

  it('não revela nem corrige nada: a marca errada é aceita', () => {
    const wrongMark = expectState(cycleDeductionMark(caseFile, inspected, 'ana', 'office-clue'));
    const state = expectState(cycleDeductionMark(caseFile, wrongMark, 'ana', 'office-clue'));

    expect(state.deductionMarks[deductionMarkKey('ana', 'office-clue')]).toBe('excludes');
  });

  it('recusa pista não descoberta, suspeito desconhecido e caso encerrado', () => {
    const solved = expectState(accuseSuspect(caseFile, inspected, 'ana'));

    expect(cycleDeductionMark(caseFile, inspected, 'bruno', 'garden-clue')).toEqual({ ok: false, reason: 'clue-not-discovered' });
    expect(cycleDeductionMark(caseFile, inspected, 'fantasma', 'office-clue')).toEqual({ ok: false, reason: 'suspect-unknown' });
    expect(cycleDeductionMark(caseFile, solved, 'bruno', 'office-clue')).toEqual({ ok: false, reason: 'investigation-finished' });
  });
});

describe('accuseSuspect', () => {
  it('encerra o caso como resolvido ao acusar o culpado', () => {
    const state = expectState(accuseSuspect(caseFile, startInvestigation(caseFile), 'ana'));

    expect(state.outcome).toBe('solved');
    expect(state.lastVerdict).toEqual({ kind: 'correct', accusedId: 'ana' });
  });

  it('gasta uma tentativa, elimina o inocente e aponta a pista que o contradiz', () => {
    const inspected = expectState(inspectPlace(caseFile, startInvestigation(caseFile), 'office'));
    const state = expectState(accuseSuspect(caseFile, inspected, 'bruno'));

    expect(state.outcome).toBe('in-progress');
    expect(state.wrongAccusationCount).toBe(1);
    expect(state.eliminatedSuspectIds).toContain('bruno');
    expect(state.lastVerdict).toMatchObject({ kind: 'wrong', accusedId: 'bruno', remainingAttempts: 2 });
    expect(state.lastVerdict && state.lastVerdict.kind === 'wrong' && state.lastVerdict.contradictingClue?.id).toBe('office-clue');
  });

  it('não aponta pista quando nada descoberto contradiz o acusado', () => {
    const state = expectState(accuseSuspect(caseFile, startInvestigation(caseFile), 'bruno'));

    expect(state.lastVerdict).toMatchObject({ kind: 'wrong', contradictingClue: null });
  });

  it('encerra o caso como perdido depois da última tentativa errada', () => {
    const extendedCase = buildCaseFile({
      suspects: [
        ...caseFile.suspects,
        { id: 'davi', name: 'Davi', role: 'Vizinho', traits: { hand: 'mão direita', shoes: 'tênis', drink: 'água', location: 'rua' } },
      ],
    });
    let state = startInvestigation(extendedCase);

    for (const suspectId of ['bruno', 'carla', 'davi']) {
      state = expectState(accuseSuspect(extendedCase, state, suspectId));
    }

    expect(state.outcome).toBe('failed');
    expect(remainingAttempts(state)).toBe(0);
  });

  it('recusa acusar quem foi descartado, quem não existe e depois do fim do caso', () => {
    const discarded = expectState(toggleSuspectElimination(caseFile, startInvestigation(caseFile), 'bruno'));
    const solved = expectState(accuseSuspect(caseFile, startInvestigation(caseFile), 'ana'));

    expect(accuseSuspect(caseFile, discarded, 'bruno')).toEqual({ ok: false, reason: 'suspect-eliminated' });
    expect(accuseSuspect(caseFile, discarded, 'fantasma')).toEqual({ ok: false, reason: 'suspect-unknown' });
    expect(accuseSuspect(caseFile, solved, 'bruno')).toEqual({ ok: false, reason: 'investigation-finished' });
    expect(inspectPlace(caseFile, solved, 'office')).toEqual({ ok: false, reason: 'investigation-finished' });
    expect(toggleSuspectElimination(caseFile, solved, 'bruno')).toEqual({ ok: false, reason: 'investigation-finished' });
  });
});
