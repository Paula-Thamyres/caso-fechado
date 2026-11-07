import type { TransitionFailure } from '../../domain/investigation';

export const TRANSITION_MESSAGES: Readonly<Record<TransitionFailure, string>> = {
  'investigation-finished': 'Este caso já foi encerrado.',
  'place-unknown': 'Esse lugar não existe neste caso.',
  'place-already-inspected': 'Você já investigou esse lugar.',
  'suspect-unknown': 'Essa pessoa não é suspeita neste caso.',
  'suspect-eliminated': 'Volte a suspeitar dessa pessoa antes de acusá-la.',
  'clue-not-discovered': 'Essa pista ainda não foi descoberta.',
};
