import type { ClueRelation, TraitKey, Traits } from './traits';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export type TraitClaim = {
  readonly trait: TraitKey;
  readonly values: readonly string[];
  readonly relation: ClueRelation;
};

export type CulpritEffect = TraitClaim & {
  readonly kind: 'culprit';
};

export type StatementEffect = TraitClaim & {
  readonly kind: 'statement';
  readonly speakerId: string;
  readonly subjectId: string;
};

export type ClueEffect = CulpritEffect | StatementEffect;

export type Clue = {
  readonly id: string;
  readonly text: string;
  readonly effect: ClueEffect | null;
};

export type Place = {
  readonly id: string;
  readonly name: string;
  readonly scene: string;
  readonly clue: Clue;
};

export type Suspect = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly traits: Traits;
};

export type CaseFile = {
  readonly id: string;
  readonly title: string;
  readonly briefing: string;
  readonly difficulty: Difficulty;
  readonly traitKeys: readonly TraitKey[];
  readonly suspects: readonly Suspect[];
  readonly places: readonly Place[];
  readonly culpritId: string;
  readonly explanation: string;
};
