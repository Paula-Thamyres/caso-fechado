import { describe, expect, it } from 'vitest';
import type { CaseFile } from '../../domain/caseFile';
import { findPossibleCulprits } from '../../domain/deduction';
import { galaBlackout } from './galaBlackout';
import { theaterSabotage } from './theaterSabotage';

function cluesOf(caseFile: CaseFile, placeIds: readonly string[]) {
  return caseFile.places.filter((place) => placeIds.includes(place.id)).map((place) => place.clue);
}

function possibleIds(caseFile: CaseFile, placeIds: readonly string[]) {
  return findPossibleCulprits(caseFile, cluesOf(caseFile, placeIds)).map((suspect) => suspect.id);
}

describe('Apagão na gala', () => {
  it('usa pistas com "ou" e pistas do que o ladrão não tem', () => {
    const effects = galaBlackout.places.flatMap((place) => (place.clue.effect ? [place.clue.effect] : []));

    expect(effects.some((effect) => effect.relation === 'has' && effect.values.length > 1)).toBe(true);
    expect(effects.some((effect) => effect.relation === 'lacks')).toBe(true);
  });

  it('nenhuma pista sozinha deixa menos de quatro suspeitos', () => {
    galaBlackout.places.forEach((place) => {
      expect(possibleIds(galaBlackout, [place.id]).length).toBeGreaterThanOrEqual(4);
    });
  });

  it('resolve com as seis pistas informativas', () => {
    expect(possibleIds(galaBlackout, ['security-room', 'showcase', 'parking-lot', 'terrace', 'bar', 'dressing-room'])).toEqual(['fausto']);
  });
});

describe('Sabotagem no teatro', () => {
  it('um depoimento sozinho não elimina ninguém', () => {
    theaterSabotage.places
      .filter((place) => place.id.startsWith('statement-'))
      .forEach((place) => {
        expect(possibleIds(theaterSabotage, [place.id])).toHaveLength(theaterSabotage.suspects.length);
      });
  });

  it('dois depoimentos que se contradizem deixam só os dois como possíveis culpados', () => {
    expect(possibleIds(theaterSabotage, ['statement-otto', 'statement-neusa']).sort()).toEqual(['neusa', 'otto']);
  });

  it('as marcas de tênis separam os dois e deixam o cenógrafo', () => {
    expect(possibleIds(theaterSabotage, ['statement-otto', 'statement-neusa', 'stage'])).toEqual(['otto']);
  });

  it('os depoimentos escondem o local de cada um: só o perfil visível está nas fichas', () => {
    expect(theaterSabotage.traitKeys).not.toContain('location');
    expect(theaterSabotage.suspects.every((suspect) => suspect.traits.location !== undefined)).toBe(true);
  });
});
