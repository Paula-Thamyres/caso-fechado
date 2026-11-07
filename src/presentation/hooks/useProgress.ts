import { useCallback, useRef, useState } from 'react';
import type { ProgressStorage } from '../../application/ports';
import { mergeResult, type CaseResult, type ProgressByCase } from '../../domain/progress';

export function useProgress(storage: ProgressStorage) {
  const [progress, setProgress] = useState<ProgressByCase>(() => storage.load());
  const latestProgress = useRef(progress);

  const recordResult = useCallback(
    (result: CaseResult) => {
      const merged = mergeResult(latestProgress.current, result);

      if (merged === latestProgress.current) {
        return;
      }

      latestProgress.current = merged;
      setProgress(merged);
      storage.save(merged);
    },
    [storage],
  );

  return { progress, recordResult };
}
