export const TRAIT_KEYS = ['hand', 'shoes', 'drink', 'location', 'accessory', 'transport'] as const;

export type TraitKey = (typeof TRAIT_KEYS)[number];

export type Traits = Readonly<Partial<Record<TraitKey, string>>>;

export type ClueRelation = 'has' | 'lacks';
