const RANK_BY_STARS: Readonly<Record<number, string>> = {
  1: 'Aprendiz',
  2: 'Detetive',
  3: 'Mestre detetive',
};

export function describeRank(stars: number): string {
  return RANK_BY_STARS[stars] ?? RANK_BY_STARS[1] ?? '';
}
