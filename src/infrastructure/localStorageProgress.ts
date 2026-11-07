import type { ProgressStorage } from '../application/ports';
import type { CaseResult, ProgressByCase } from '../domain/progress';

export const PROGRESS_STORAGE_KEY = 'caso-fechado:progress';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function isCaseResult(value: unknown): value is CaseResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.caseId === 'string' &&
    Number.isInteger(candidate.stars) &&
    Number.isInteger(candidate.inspectedCount) &&
    Number.isInteger(candidate.wrongAccusationCount)
  );
}

function parseProgress(rawValue: string | null): ProgressByCase {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => isCaseResult(value)));
  } catch {
    return {};
  }
}

export function createLocalStorageProgress(storage: StorageLike = window.localStorage): ProgressStorage {
  return {
    load() {
      try {
        return parseProgress(storage.getItem(PROGRESS_STORAGE_KEY));
      } catch {
        return {};
      }
    },
    save(progress) {
      try {
        storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
      } catch {
        return;
      }
    },
  };
}
