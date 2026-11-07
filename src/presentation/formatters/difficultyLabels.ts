import type { Difficulty } from '../../domain/caseFile';

export const DIFFICULTY_LABELS: Readonly<Record<Difficulty, string>> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  expert: 'Difícil+',
  master: 'Mestre',
};
