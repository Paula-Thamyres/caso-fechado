import { useState } from 'react';
import type { ProgressStorage, TutorialStorage } from '../application/ports';
import type { CaseFile } from '../domain/caseFile';
import { CaseSelection } from './components/CaseSelection';
import { InvestigationScreen } from './components/InvestigationScreen';
import { Tutorial } from './components/Tutorial';
import { useProgress } from './hooks/useProgress';

type AppProps = {
  readonly cases: readonly CaseFile[];
  readonly progressStorage: ProgressStorage;
  readonly tutorialStorage: TutorialStorage;
};

export function App({ cases, progressStorage, tutorialStorage }: AppProps) {
  const { progress, recordResult } = useProgress(progressStorage);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [restartCount, setRestartCount] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(() => !tutorialStorage.hasSeen());

  const selectedCase = cases.find((caseFile) => caseFile.id === selectedCaseId);

  function closeTutorial() {
    tutorialStorage.markSeen();
    setIsTutorialOpen(false);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Jogo de dedução</p>
          <h1 className="font-display text-4xl font-bold text-heading">Caso Fechado</h1>
        </div>
        <button type="button" className="button button-secondary" onClick={() => setIsTutorialOpen(true)}>
          Como jogar
        </button>
      </header>

      <main>
        {selectedCase ? (
          <InvestigationScreen
            key={`${selectedCase.id}-${restartCount}`}
            caseFile={selectedCase}
            onSolved={recordResult}
            onRestart={() => setRestartCount(restartCount + 1)}
            onBack={() => setSelectedCaseId(null)}
          />
        ) : (
          <CaseSelection cases={cases} progress={progress} onSelectCase={setSelectedCaseId} />
        )}
      </main>

      {isTutorialOpen && <Tutorial onClose={closeTutorial} />}
    </div>
  );
}
