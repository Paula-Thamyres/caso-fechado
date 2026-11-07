import type { Place } from '../../domain/caseFile';

type PlaceBoardProps = {
  readonly places: readonly Place[];
  readonly inspectedPlaceIds: readonly string[];
  readonly isLocked: boolean;
  readonly onInspect: (placeId: string) => void;
};

export function PlaceBoard({ places, inspectedPlaceIds, isLocked, onInspect }: PlaceBoardProps) {
  return (
    <section aria-labelledby="places-title">
      <h3 id="places-title" className="font-display text-lg font-bold text-heading">
        Lugares
      </h3>
      <ul className="mt-3 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
        {places.map((place) => {
          const isInspected = inspectedPlaceIds.includes(place.id);

          return (
            <li key={place.id}>
              {isInspected ? (
                <p className="flex h-full min-h-14 items-center justify-between gap-2 rounded-xl border border-panel-border bg-[var(--note-surface)] px-3 py-2 text-sm font-semibold text-accent">
                  {place.name}
                  <span aria-label="investigado">✓</span>
                </p>
              ) : (
                <button
                  type="button"
                  className="panel flex min-h-14 w-full cursor-pointer flex-col items-start justify-center gap-0.5 px-3 py-2 text-left transition-colors hover:bg-[var(--hover-surface)] disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={isLocked}
                  aria-label={`Investigar ${place.name}`}
                  onClick={() => onInspect(place.id)}
                >
                  <span className="text-sm font-semibold text-heading">{place.name}</span>
                  <span className="text-sm text-muted">Investigar</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
