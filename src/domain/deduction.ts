import type { CaseFile, Clue, Suspect, TraitClaim } from './caseFile';
import type { TraitKey } from './traits';

export function claimHolds(claim: TraitClaim, value: string | undefined): boolean {
  const isListed = value !== undefined && claim.values.includes(value);

  return claim.relation === 'has' ? isListed : !isListed;
}

function traitDomain(caseFile: CaseFile, subject: Suspect, trait: TraitKey): readonly string[] {
  const knownValue = subject.traits[trait];

  if (knownValue !== undefined && caseFile.traitKeys.includes(trait)) {
    return [knownValue];
  }

  const valuesFromSuspects = caseFile.suspects.flatMap((suspect) => suspect.traits[trait] ?? []);
  const valuesFromClues = caseFile.places.flatMap((place) => (place.clue.effect?.trait === trait ? place.clue.effect.values : []));

  return [...new Set([...valuesFromSuspects, ...valuesFromClues])];
}

export function isPossibleCulprit(caseFile: CaseFile, suspect: Suspect, clues: readonly Clue[]): boolean {
  const effects = clues.flatMap((clue) => (clue.effect ? [clue.effect] : []));

  const satisfiesPhysicalClues = effects.every((effect) => effect.kind !== 'culprit' || claimHolds(effect, suspect.traits[effect.trait]));

  if (!satisfiesPhysicalClues) {
    return false;
  }

  const possibleValues = new Map<string, readonly string[]>();

  for (const effect of effects) {
    const subject = caseFile.suspects.find((candidate) => candidate.id === (effect.kind === 'statement' ? effect.subjectId : ''));

    if (effect.kind !== 'statement' || !subject) {
      continue;
    }

    const key = `${subject.id}:${effect.trait}`;
    const domain = possibleValues.get(key) ?? traitDomain(caseFile, subject, effect.trait);
    const mustBeTrue = effect.speakerId !== suspect.id;

    possibleValues.set(
      key,
      domain.filter((value) => claimHolds(effect, value) === mustBeTrue),
    );
  }

  return [...possibleValues.values()].every((values) => values.length > 0);
}

export function findPossibleCulprits(caseFile: CaseFile, clues: readonly Clue[]): readonly Suspect[] {
  return caseFile.suspects.filter((suspect) => isPossibleCulprit(caseFile, suspect, clues));
}

export function findContradictingClue(caseFile: CaseFile, suspect: Suspect, clues: readonly Clue[]): Clue | null {
  for (let index = 0; index < clues.length; index += 1) {
    if (!isPossibleCulprit(caseFile, suspect, clues.slice(0, index + 1))) {
      return clues[index] ?? null;
    }
  }

  return null;
}
