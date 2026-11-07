import type { Clue, Suspect } from '../../domain/caseFile';
import { deductionMarkKey, type DeductionMark } from '../../domain/investigation';
import type { TraitKey } from '../../domain/traits';
import { TRAIT_LABELS } from '../formatters/traitLabels';

type DeductionBoardProps = {
  readonly suspects: readonly Suspect[];
  readonly traitKeys: readonly TraitKey[];
  readonly clues: readonly Clue[];
  readonly marks: Readonly<Record<string, DeductionMark>>;
  readonly eliminatedSuspectIds: readonly string[];
  readonly isLocked: boolean;
  readonly onCycleMark: (suspectId: string, clueId: string) => void;
  readonly onToggleElimination: (suspectId: string) => void;
  readonly onAccuse: (suspectId: string) => void;
};

const MARK_SYMBOLS: Readonly<Record<DeductionMark | 'unknown', string>> = {
  unknown: '?',
  matches: '✓',
  excludes: '✗',
};

const MARK_LABELS: Readonly<Record<DeductionMark | 'unknown', string>> = {
  unknown: 'ainda não sei',
  matches: 'combina',
  excludes: 'não combina',
};

const MARK_CLASSES: Readonly<Record<DeductionMark | 'unknown', string>> = {
  unknown: 'border-panel-border text-muted',
  matches: 'border-success bg-success/15 text-success',
  excludes: 'border-danger bg-danger/15 text-danger',
};

export function DeductionBoard({
  suspects,
  traitKeys,
  clues,
  marks,
  eliminatedSuspectIds,
  isLocked,
  onCycleMark,
  onToggleElimination,
  onAccuse,
}: DeductionBoardProps) {
  const profileHeader = traitKeys.map((traitKey) => TRAIT_LABELS[traitKey]).join(' · ');

  return (
    <section aria-labelledby="board-title" className="panel p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="board-title" className="font-display text-lg font-bold text-heading">
          Quadro de dedução
        </h3>
        <p className="text-sm text-muted">
          Clique na célula para alternar: <strong>?</strong> não sei · <strong className="text-success">✓</strong> combina com a pista ·{' '}
          <strong className="text-danger">✗</strong> não combina
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-sm uppercase tracking-wider text-muted">
              <th scope="col" className="pb-2 pr-3 font-semibold">
                Suspeito
              </th>
              <th scope="col" className="pb-2 pr-3 font-semibold">
                Perfil <span className="block text-xs font-normal normal-case tracking-normal">{profileHeader}</span>
              </th>
              {clues.map((clue, index) => (
                <th key={clue.id} scope="col" className="w-12 pb-2 text-center font-semibold">
                  P{index + 1}
                </th>
              ))}
              <th scope="col" className="pb-2 pl-3 text-right font-semibold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {suspects.map((suspect) => {
              const isEliminated = eliminatedSuspectIds.includes(suspect.id);

              return (
                <tr key={suspect.id} className="border-t border-panel-border align-middle" data-eliminated={isEliminated}>
                  <th scope="row" className={`py-3 pr-3 text-left font-normal ${isEliminated ? 'opacity-50' : ''}`}>
                    <span className={`block font-display text-base font-bold text-heading ${isEliminated ? 'line-through' : ''}`}>
                      {suspect.name}
                    </span>
                    <span className="block text-sm text-muted">{isEliminated ? 'Descartado' : suspect.role}</span>
                  </th>
                  <td className={`py-3 pr-3 ${isEliminated ? 'opacity-50' : ''}`}>
                    <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
                      {traitKeys.map((traitKey) => (
                        <li
                          key={traitKey}
                          title={TRAIT_LABELS[traitKey]}
                          className="rounded-md border border-panel-border px-2 py-0.5 text-sm text-muted"
                        >
                          {suspect.traits[traitKey] ?? ''}
                        </li>
                      ))}
                    </ul>
                  </td>
                  {clues.map((clue, index) => {
                    const mark = marks[deductionMarkKey(suspect.id, clue.id)] ?? 'unknown';

                    return (
                      <td key={clue.id} className="py-3 text-center">
                        <button
                          type="button"
                          disabled={isLocked}
                          aria-label={`${suspect.name}, pista ${index + 1}: ${MARK_LABELS[mark]}`}
                          className={`h-9 w-9 cursor-pointer rounded-lg border text-base font-bold transition-colors hover:bg-[var(--hover-surface)] disabled:cursor-not-allowed disabled:opacity-45 ${MARK_CLASSES[mark]}`}
                          onClick={() => onCycleMark(suspect.id, clue.id)}
                        >
                          {MARK_SYMBOLS[mark]}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 pl-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="button button-secondary px-3 py-1.5"
                        disabled={isLocked}
                        aria-label={`${isEliminated ? 'Voltar a suspeitar de' : 'Descartar'} ${suspect.name}`}
                        onClick={() => onToggleElimination(suspect.id)}
                      >
                        {isEliminated ? 'Voltar' : 'Descartar'}
                      </button>
                      <button
                        type="button"
                        className="button button-danger px-3 py-1.5"
                        disabled={isLocked || isEliminated}
                        aria-label={`Acusar ${suspect.name}`}
                        onClick={() => onAccuse(suspect.id)}
                      >
                        Acusar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {clues.some((clue) => clue.effect?.kind === 'statement') && (
        <p className="clue-note mt-4 text-sm">
          Nos depoimentos, só o culpado mente. Se um depoimento ficaria incoerente com uma pessoa ser a culpada, marque <strong className="text-danger">✗</strong> nela.
        </p>
      )}

      {clues.length === 0 && <p className="mt-3 text-sm text-muted">Investigue um lugar para liberar a primeira coluna do quadro.</p>}
    </section>
  );
}
