import type { TraitKey } from '../../domain/traits';

export const TRAIT_LABELS: Readonly<Record<TraitKey, string>> = {
  hand: 'Mão dominante',
  shoes: 'Calçado',
  drink: 'Bebida favorita',
  location: 'Estava às 21h em',
  accessory: 'Acessório',
  transport: 'Chegou de',
};
