import type { CaseFile } from '../../domain/caseFile';
import type { CaseResult } from '../../domain/progress';
import { describeRank } from '../formatters/rankLabels';
import { Modal } from './Modal';
import { StarRating } from './StarRating';

function describeCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

type ResultDialogProps = {
  readonly caseFile: CaseFile;
  readonly result: CaseResult | null;
  readonly onPlayAgain: () => void;
  readonly onBackToCases: () => void;
  readonly onClose: () => void;
};

export function ResultDialog({ caseFile, result, onPlayAgain, onBackToCases, onClose }: ResultDialogProps) {
  const culprit = caseFile.suspects.find((suspect) => suspect.id === caseFile.culpritId);
  const title = result ? 'Caso resolvido' : 'O culpado escapou';

  return (
    <Modal title={title} eyebrow={caseFile.title} onClose={onClose}>
      {result ? (
        <div className="flex items-center gap-3">
          <StarRating stars={result.stars} />
          <p className="text-sm font-semibold text-heading">{describeRank(result.stars)}</p>
        </div>
      ) : (
        <p className="text-sm text-muted">Você usou todas as tentativas. O culpado era {culprit?.name}.</p>
      )}
      {result && (
        <p className="mt-2 text-sm text-muted">
          {describeCount(result.inspectedCount, 'lugar investigado', 'lugares investigados')} e{' '}
          {describeCount(result.wrongAccusationCount, 'acusação errada', 'acusações erradas')}.
        </p>
      )}
      <p className="clue-note mt-4 text-sm leading-relaxed">
        <span className="font-semibold text-accent">Como se chegava ao culpado: </span>
        {caseFile.explanation}
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" className="button button-secondary" onClick={onBackToCases}>
          Voltar aos casos
        </button>
        <button type="button" className="button button-primary" onClick={onPlayAgain}>
          Jogar de novo
        </button>
      </div>
    </Modal>
  );
}
