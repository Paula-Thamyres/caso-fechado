import { MAXIMUM_STARS } from '../../domain/caseRules';

type StarRatingProps = {
  readonly stars: number;
};

export function StarRating({ stars }: StarRatingProps) {
  return (
    <span role="img" aria-label={`${stars} de ${MAXIMUM_STARS} estrelas`} className="text-lg tracking-widest text-accent">
      {Array.from({ length: MAXIMUM_STARS }, (_, index) => (index < stars ? '★' : '☆')).join('')}
    </span>
  );
}
