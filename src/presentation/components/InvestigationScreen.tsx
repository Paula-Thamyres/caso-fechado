import { useEffect, useMemo, useState } from 'react';
import type { CaseFile } from '../../domain/caseFile';
import { remainingAttempts } from '../../domain/investigation';
import { buildCaseResult, type CaseResult } from '../../domain/progress';
import { describeVerdict } from '../formatters/verdictMessages';
import { useInvestigation } from '../hooks/useInvestigation';
import { AccusationDialog } from './AccusationDialog';
import { ClueNotebook } from './ClueNotebook';
import { DeductionBoard } from './DeductionBoard';
import { Notice } from './Notice';
import { PlaceBoard } from './PlaceBoard';
import { ResultDialog } from './ResultDialog';

type InvestigationScreenProps = {
  readonly caseFile: CaseFile;
  readonly onSolved: (result: CaseResult) => void;
  readonly onRestart: () => void;
  readonly onBack: () => void;
};

export function InvestigationScreen({ caseFile, onSolved, onRestart, onBack }: InvestigationScreenProps) {
  const { state, inspectedPlaces, discoveredClues, notice, inspect, toggleElimination, cycleMark, accuse } = useInvestigation(caseFile);
  const [pendingAccusationId, setPendingAccusationId] = useState<string | null>(null);
  const [isResultDismissed, setIsResultDismissed] = useState(false);

  const result = useMemo(() => buildCaseResult(caseFile, state), [caseFile, state]);
  const isFinished = state.outcome !== 'in-progress';
  const pendingSuspect = caseFile.suspects.find((suspect) => suspect.id === pendingAccusationId);
  const verdict = state.lastVerdict;
  const accusedSuspect = verdict && caseFile.suspects.find((suspect) => suspect.id === verdict.accusedId);

  useEffect(() => {
    if (result) {
      onSolved(result);
    }
  }, [result, onSolved]);

  function confirmAccusation() {
    if (pendingAccusationId) {
      accuse(pendingAccusationId);
    }

    setPendingAccusationId(null);
  }

  return (
    <section aria-labelledby="investigation-title" className="flex flex-col gap-5">
      <div>
        <button type="button" className="button button-secondary" onClick={onBack}>
          Voltar aos casos
        </button>
        <h2 id="investigation-title" className="mt-4 font-display text-2xl font-bold text-heading">
          {caseFile.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{caseFile.briefing}</p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
        <p>
          Lugares investigados: <strong className="text-heading">{state.inspectedPlaceIds.length}</strong> de {caseFile.places.length}
        </p>
        <p>
          Tentativas restantes: <strong className="text-heading">{remainingAttempts(state)}</strong>
        </p>
      </div>

      <div aria-live="polite" className="flex flex-col gap-3">
        {notice && <Notice tone="info">{notice}</Notice>}
        {verdict && accusedSuspect && (
          <Notice tone={verdict.kind === 'correct' ? 'success' : 'danger'}>{describeVerdict(verdict, accusedSuspect.name)}</Notice>
        )}
        {isFinished && isResultDismissed && (
          <div className="flex flex-wrap items-center gap-3">
            <Notice tone="info">Caso encerrado.</Notice>
            <button type="button" className="button button-secondary" onClick={() => setIsResultDismissed(false)}>
              Ver resultado
            </button>
          </div>
        )}
      </div>

      <PlaceBoard places={caseFile.places} inspectedPlaceIds={state.inspectedPlaceIds} isLocked={isFinished} onInspect={inspect} />

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <DeductionBoard
          suspects={caseFile.suspects}
          traitKeys={caseFile.traitKeys}
          clues={discoveredClues}
          marks={state.deductionMarks}
          eliminatedSuspectIds={state.eliminatedSuspectIds}
          isLocked={isFinished}
          onCycleMark={cycleMark}
          onToggleElimination={toggleElimination}
          onAccuse={setPendingAccusationId}
        />
        <ClueNotebook inspectedPlaces={inspectedPlaces} />
      </div>

      {pendingSuspect && (
        <AccusationDialog
          suspect={pendingSuspect}
          remainingAttempts={remainingAttempts(state)}
          onConfirm={confirmAccusation}
          onCancel={() => setPendingAccusationId(null)}
        />
      )}

      {isFinished && !isResultDismissed && (
        <ResultDialog
          caseFile={caseFile}
          result={result}
          onPlayAgain={onRestart}
          onBackToCases={onBack}
          onClose={() => setIsResultDismissed(true)}
        />
      )}
    </section>
  );
}
