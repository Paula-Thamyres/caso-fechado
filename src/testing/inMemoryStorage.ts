import type { ProgressStorage, TutorialStorage } from '../application/ports';
import type { ProgressByCase } from '../domain/progress';

export function createInMemoryProgress(initial: ProgressByCase = {}): ProgressStorage & { readonly current: () => ProgressByCase } {
  let stored = initial;

  return {
    load: () => stored,
    save: (progress) => {
      stored = progress;
    },
    current: () => stored,
  };
}

export function createInMemoryTutorial(alreadySeen = false): TutorialStorage {
  let seen = alreadySeen;

  return {
    hasSeen: () => seen,
    markSeen: () => {
      seen = true;
    },
  };
}
