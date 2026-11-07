import { useState } from 'react';
import { TUTORIAL_STEPS } from '../tutorial/tutorialSteps';
import { Modal } from './Modal';

type TutorialProps = {
  readonly onClose: () => void;
};

export function Tutorial({ onClose }: TutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = TUTORIAL_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === TUTORIAL_STEPS.length - 1;

  if (!step) {
    return null;
  }

  return (
    <Modal title={step.title} eyebrow={`Como jogar · passo ${stepIndex + 1} de ${TUTORIAL_STEPS.length}`} onClose={onClose}>
      <p className="text-sm leading-relaxed">{step.description}</p>
      <p className="clue-note mt-4 text-sm">
        <span className="font-semibold text-accent">Exemplo: </span>
        {step.example}
      </p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" className="button button-secondary" disabled={isFirstStep} onClick={() => setStepIndex(stepIndex - 1)}>
          Voltar
        </button>
        {isLastStep ? (
          <button type="button" className="button button-primary" onClick={onClose}>
            Começar a investigar
          </button>
        ) : (
          <button type="button" className="button button-primary" onClick={() => setStepIndex(stepIndex + 1)}>
            Próximo
          </button>
        )}
      </div>
    </Modal>
  );
}
