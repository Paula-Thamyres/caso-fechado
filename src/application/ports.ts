import type { ProgressByCase } from '../domain/progress';

export interface ProgressStorage {
  load(): ProgressByCase;
  save(progress: ProgressByCase): void;
}

export interface TutorialStorage {
  hasSeen(): boolean;
  markSeen(): void;
}
