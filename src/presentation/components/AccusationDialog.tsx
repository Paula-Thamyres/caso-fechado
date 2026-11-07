import type { Suspect } from '../../domain/caseFile';
import { Modal } from './Modal';

type AccusationDialogProps = {
  readonly suspect: Suspect;
  readonly remainingAttempts: number;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
};

export function AccusationDialog({ suspect, remainingAttempts, onConfirm, onCancel }: AccusationDialogProps) {
  return (
    <Modal title={`Acusar ${suspect.name}?`} eyebrow="Acusação" onClose={onCancel}>
      <p className="text-sm leading-relaxed">
        Você acusará {suspect.name} ({suspect.role.toLowerCase()}). Se errar, perde uma tentativa. Tentativas restantes:{' '}
        <strong>{remainingAttempts}</strong>.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className="button button-primary" onClick={onConfirm}>
          Confirmar acusação
        </button>
      </div>
    </Modal>
  );
}
