import { describe, expect, it } from 'vitest';
import { buildCaseFile } from '../testing/buildCaseFile';
import { accuseSuspect, inspectPlace, startInvestigation } from './investigation';
import { buildCaseResult, isBetterResult, mergeResult, type CaseResult } from './progress';

const caseFile = buildCaseFile();

function result(overrides: Partial<CaseResult> = {}): CaseResult {
  return { caseId: 'test-case', stars: 2, inspectedCount: 3, wrongAccusationCount: 0, ...overrides };
}

describe('buildCaseResult', () => {
  it('só gera resultado para casos resolvidos', () => {
    expect(buildCaseResult(caseFile, startInvestigation(caseFile))).toBeNull();
  });

  it('calcula as estrelas de um caso resolvido', () => {
    const inspected = inspectPlace(caseFile, startInvestigation(caseFile), 'office');
    const solved = inspected.ok ? accuseSuspect(caseFile, inspected.state, 'ana') : inspected;

    expect(solved.ok && buildCaseResult(caseFile, solved.state)).toEqual({
      caseId: 'test-case',
      stars: 3,
      inspectedCount: 1,
      wrongAccusationCount: 0,
    });
  });
});

describe('isBetterResult', () => {
  it('prefere mais estrelas e, empatando, menos lugares investigados', () => {
    expect(isBetterResult(result({ stars: 3 }), result({ stars: 2 }))).toBe(true);
    expect(isBetterResult(result({ inspectedCount: 2 }), result({ inspectedCount: 3 }))).toBe(true);
    expect(isBetterResult(result(), result())).toBe(false);
  });
});

describe('mergeResult', () => {
  it('guarda o primeiro resultado de um caso', () => {
    expect(mergeResult({}, result())).toEqual({ 'test-case': result() });
  });

  it('troca só quando o novo resultado é melhor', () => {
    const progress = { 'test-case': result({ stars: 2 }) };

    expect(mergeResult(progress, result({ stars: 1 }))).toBe(progress);
    expect(mergeResult(progress, result({ stars: 3 }))['test-case']?.stars).toBe(3);
  });
});
