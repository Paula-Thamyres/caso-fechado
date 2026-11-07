import { describe, expect, it } from 'vitest';
import { allowedInspections, calculateStars } from './scoring';

const base = { totalPlaces: 6, minimumClues: 3, inspectedCount: 3, wrongAccusationCount: 0 };

describe('allowedInspections', () => {
  it('permite o mínimo mais metade da folga', () => {
    expect(allowedInspections(6, 3)).toBe(4);
    expect(allowedInspections(4, 2)).toBe(3);
  });
});

describe('calculateStars', () => {
  it('dá 3 estrelas sem erros e com investigação enxuta', () => {
    expect(calculateStars(base)).toBe(3);
    expect(calculateStars({ ...base, inspectedCount: 4 })).toBe(3);
  });

  it('tira uma estrela por investigar demais', () => {
    expect(calculateStars({ ...base, inspectedCount: 6 })).toBe(2);
  });

  it('tira uma estrela por acusação errada', () => {
    expect(calculateStars({ ...base, wrongAccusationCount: 1 })).toBe(2);
  });

  it('nunca fica abaixo de 1 estrela', () => {
    expect(calculateStars({ ...base, inspectedCount: 6, wrongAccusationCount: 2 })).toBe(1);
  });
});
