import type { ReactNode } from 'react';

type NoticeProps = {
  readonly tone: 'info' | 'danger' | 'success';
  readonly children: ReactNode;
};

const TONE_CLASSES: Readonly<Record<NoticeProps['tone'], string>> = {
  info: 'border-panel-border text-muted',
  danger: 'border-danger text-danger',
  success: 'border-success text-success',
};

export function Notice({ tone, children }: NoticeProps) {
  return (
    <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${TONE_CLASSES[tone]}`}>
      {children}
    </p>
  );
}
