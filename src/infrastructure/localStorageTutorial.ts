import type { TutorialStorage } from '../application/ports';

export const TUTORIAL_STORAGE_KEY = 'caso-fechado:tutorial-seen';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function createLocalStorageTutorial(storage: StorageLike = window.localStorage): TutorialStorage {
  return {
    hasSeen() {
      try {
        return storage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
      } catch {
        return false;
      }
    },
    markSeen() {
      try {
        storage.setItem(TUTORIAL_STORAGE_KEY, 'true');
      } catch {
        return;
      }
    },
  };
}
