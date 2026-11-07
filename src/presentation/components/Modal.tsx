import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

type ModalProps = {
  readonly title: string;
  readonly eyebrow?: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
};

const FOCUSABLE_SELECTOR = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href]';

export function Modal({ title, eyebrow, onClose, children }: ModalProps) {
  const titleId = useId();
  const dialogReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    dialogReference.current?.focus();

    return () => {
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, []);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  function keepFocusInside(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab' || !dialogReference.current) {
      return;
    }

    const focusableElements = [...dialogReference.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === dialogReference.current)) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogReference}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="panel max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 shadow-2xl outline-none"
        onKeyDown={keepFocusInside}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-sm font-bold uppercase tracking-widest text-accent">{eyebrow}</p>}
            <h2 id={titleId} className="break-words font-display text-xl font-bold text-heading">
              {title}
            </h2>
          </div>
          <button type="button" className="button button-secondary flex-none px-3 py-1.5" aria-label="Fechar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
