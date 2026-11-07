import type { CaseFile, ClueEffect } from './caseFile';
import { MINIMUM_PLACES, MINIMUM_SUSPECTS } from './caseRules';
import { claimHolds, findPossibleCulprits } from './deduction';

export type CaseIssueCode =
  | 'too-few-suspects'
  | 'too-few-places'
  | 'duplicate-suspect-id'
  | 'duplicate-place-id'
  | 'duplicate-clue-id'
  | 'suspect-trait-missing'
  | 'culprit-missing'
  | 'clue-value-unknown'
  | 'clue-trait-hidden'
  | 'statement-person-unknown'
  | 'statement-contradicts-truth'
  | 'culprit-contradicted'
  | 'ambiguous-solution';

export type CaseIssue = {
  readonly code: CaseIssueCode;
  readonly detail: string;
};

function findDuplicates(identifiers: readonly string[]): readonly string[] {
  return identifiers.filter((identifier, index) => identifiers.indexOf(identifier) !== index);
}

function validateStructure(caseFile: CaseFile): CaseIssue[] {
  const issues: CaseIssue[] = [];

  if (caseFile.suspects.length < MINIMUM_SUSPECTS) {
    issues.push({ code: 'too-few-suspects', detail: `O caso precisa de pelo menos ${MINIMUM_SUSPECTS} suspeitos.` });
  }

  if (caseFile.places.length < MINIMUM_PLACES) {
    issues.push({ code: 'too-few-places', detail: `O caso precisa de pelo menos ${MINIMUM_PLACES} lugares.` });
  }

  findDuplicates(caseFile.suspects.map((suspect) => suspect.id)).forEach((identifier) =>
    issues.push({ code: 'duplicate-suspect-id', detail: identifier }),
  );
  findDuplicates(caseFile.places.map((place) => place.id)).forEach((identifier) =>
    issues.push({ code: 'duplicate-place-id', detail: identifier }),
  );
  findDuplicates(caseFile.places.map((place) => place.clue.id)).forEach((identifier) =>
    issues.push({ code: 'duplicate-clue-id', detail: identifier }),
  );

  caseFile.suspects.forEach((suspect) =>
    caseFile.traitKeys
      .filter((traitKey) => suspect.traits[traitKey] === undefined)
      .forEach((traitKey) => issues.push({ code: 'suspect-trait-missing', detail: `${suspect.id}:${traitKey}` })),
  );

  return issues;
}

function validateEffect(caseFile: CaseFile, clueId: string, effect: ClueEffect): CaseIssue[] {
  const knownValues = new Set(caseFile.suspects.flatMap((suspect) => suspect.traits[effect.trait] ?? []));

  if (effect.kind === 'culprit') {
    const hasKnownValue = effect.values.some((value) => knownValues.has(value));
    const visibilityIssues: CaseIssue[] = caseFile.traitKeys.includes(effect.trait) ? [] : [{ code: 'clue-trait-hidden', detail: clueId }];

    return hasKnownValue ? visibilityIssues : [...visibilityIssues, { code: 'clue-value-unknown', detail: clueId }];
  }

  const speaker = caseFile.suspects.find((suspect) => suspect.id === effect.speakerId);
  const subject = caseFile.suspects.find((suspect) => suspect.id === effect.subjectId);

  if (!speaker || !subject) {
    return [{ code: 'statement-person-unknown', detail: clueId }];
  }

  const isTruthful = claimHolds(effect, subject.traits[effect.trait]);
  const shouldBeTruthful = speaker.id !== caseFile.culpritId;

  return isTruthful === shouldBeTruthful ? [] : [{ code: 'statement-contradicts-truth', detail: clueId }];
}

function validateClues(caseFile: CaseFile): CaseIssue[] {
  return caseFile.places.flatMap((place) => (place.clue.effect ? validateEffect(caseFile, place.clue.id, place.clue.effect) : []));
}

function validateSolution(caseFile: CaseFile): CaseIssue[] {
  const culprit = caseFile.suspects.find((suspect) => suspect.id === caseFile.culpritId);

  if (!culprit) {
    return [{ code: 'culprit-missing', detail: caseFile.culpritId }];
  }

  const possibleCulprits = findPossibleCulprits(
    caseFile,
    caseFile.places.map((place) => place.clue),
  );

  if (!possibleCulprits.some((suspect) => suspect.id === culprit.id)) {
    return [{ code: 'culprit-contradicted', detail: culprit.id }];
  }

  if (possibleCulprits.length > 1) {
    return [{ code: 'ambiguous-solution', detail: possibleCulprits.map((suspect) => suspect.id).join(', ') }];
  }

  return [];
}

export function validateCaseFile(caseFile: CaseFile): readonly CaseIssue[] {
  return [...validateStructure(caseFile), ...validateClues(caseFile), ...validateSolution(caseFile)];
}
