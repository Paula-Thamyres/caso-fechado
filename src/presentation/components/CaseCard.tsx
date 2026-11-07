import type { CaseFile } from '../../domain/caseFile';
import type { CaseResult } from '../../domain/progress';
import { DIFFICULTY_LABELS } from '../formatters/difficultyLabels';
import { describeRank } from '../formatters/rankLabels';
import { StarRating } from './StarRating';

type CaseCardProps = {
  readonly caseFile: CaseFile;
  readonly result: CaseResult | undefined;
  readonly onInvestigate: () => void;
};

export function CaseCard({ caseFile, result, onInvestigate }: CaseCardProps) {
  return (
    <li className="panel flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold text-heading">{caseFile.title}</h3>
        <span className="flex-none rounded-full border border-panel-border px-3 py-1 text-sm font-semibold text-muted">
          {DIFFICULTY_LABELS[caseFile.difficulty]}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted">{caseFile.briefing}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        {result ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <StarRating stars={result.stars} />
            {describeRank(result.stars)}
          </p>
        ) : (
          <p className="text-sm text-muted">Ainda sem resultado</p>
        )}
        <button type="button" className="button button-primary" onClick={onInvestigate}>
          {result ? 'Investigar de novo' : 'Investigar'}
          <span className="sr-only">: {caseFile.title}</span>
        </button>
      </div>
    </li>
  );
}
