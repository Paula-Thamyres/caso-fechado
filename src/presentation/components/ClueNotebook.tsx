import type { Place } from '../../domain/caseFile';

type ClueNotebookProps = {
  readonly inspectedPlaces: readonly Place[];
};

export function ClueNotebook({ inspectedPlaces }: ClueNotebookProps) {
  return (
    <section aria-labelledby="notebook-title" className="panel p-5 xl:sticky xl:top-4">
      <h3 id="notebook-title" className="font-display text-lg font-bold text-heading">
        Caderno de pistas
      </h3>
      {inspectedPlaces.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nenhuma pista ainda. Investigue um lugar para começar.</p>
      ) : (
        <ol className="mt-3 flex list-none flex-col gap-3 p-0">
          {inspectedPlaces.map((place, index) => (
            <li key={place.id} className="clue-note text-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-accent">
                Pista {index + 1} · {place.name}
              </p>
              <p className="mt-1 text-sm text-muted">{place.scene}</p>
              <p className="mt-1.5">{place.clue.text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
