import type { CaseFile } from '../../domain/caseFile';
import type { ProgressByCase } from '../../domain/progress';
import { CaseCard } from './CaseCard';

type CaseSelectionProps = {
  readonly cases: readonly CaseFile[];
  readonly progress: ProgressByCase;
  readonly onSelectCase: (caseId: string) => void;
};

export function CaseSelection({ cases, progress, onSelectCase }: CaseSelectionProps) {
  return (
    <section aria-labelledby="case-selection-title">
      <h2 id="case-selection-title" className="font-display text-2xl font-bold text-heading">
        Escolha um caso
      </h2>
      <p className="mt-1 text-sm text-muted">Comece pelo mais fácil e suba a dificuldade quando se sentir pronta.</p>
      <ul className="mt-5 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((caseFile) => (
          <CaseCard
            key={caseFile.id}
            caseFile={caseFile}
            result={progress[caseFile.id]}
            onInvestigate={() => onSelectCase(caseFile.id)}
          />
        ))}
      </ul>
    </section>
  );
}
