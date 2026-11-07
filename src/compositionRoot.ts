import { createLocalStorageProgress } from './infrastructure/localStorageProgress';
import { createLocalStorageTutorial } from './infrastructure/localStorageTutorial';

export const progressStorage = createLocalStorageProgress();
export const tutorialStorage = createLocalStorageTutorial();
