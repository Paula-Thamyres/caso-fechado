import type { AccusationVerdict } from '../../domain/investigation';

export function describeVerdict(verdict: AccusationVerdict, accusedName: string): string {
  if (verdict.kind === 'correct') {
    return `${accusedName} é o culpado.`;
  }

  const attemptsText =
    verdict.remainingAttempts === 1 ? 'Resta 1 tentativa.' : `Restam ${verdict.remainingAttempts} tentativas.`;

  if (verdict.contradictingClue) {
    return `${accusedName} é inocente. As pistas já contradiziam essa acusação, a partir de "${verdict.contradictingClue.text}" ${attemptsText}`;
  }

  return `${accusedName} é inocente. Nenhuma pista descoberta apontava isso ainda: investigue mais lugares. ${attemptsText}`;
}
