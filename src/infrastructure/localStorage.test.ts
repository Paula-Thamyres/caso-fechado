import { describe, expect, it } from 'vitest';
import { createLocalStorageProgress, PROGRESS_STORAGE_KEY } from './localStorageProgress';
import { createLocalStorageTutorial, TUTORIAL_STORAGE_KEY } from './localStorageTutorial';

function createFakeStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

const brokenStorage = {
  getItem: () => {
    throw new Error('bloqueado');
  },
  setItem: () => {
    throw new Error('bloqueado');
  },
};

describe('createLocalStorageProgress', () => {
  const result = { caseId: 'a', stars: 3, inspectedCount: 2, wrongAccusationCount: 0 };

  it('salva e carrega o progresso', () => {
    const progress = createLocalStorageProgress(createFakeStorage());

    progress.save({ a: result });

    expect(progress.load()).toEqual({ a: result });
  });

  it('começa vazio quando não há nada salvo', () => {
    expect(createLocalStorageProgress(createFakeStorage()).load()).toEqual({});
  });

  it.each(['não é json', '[]', 'null', '"texto"'])('ignora conteúdo inválido: %s', (rawValue) => {
    expect(createLocalStorageProgress(createFakeStorage({ [PROGRESS_STORAGE_KEY]: rawValue })).load()).toEqual({});
  });

  it('descarta só as entradas inválidas', () => {
    const rawValue = JSON.stringify({ a: result, b: { caseId: 'b', stars: 'muitas' } });

    expect(createLocalStorageProgress(createFakeStorage({ [PROGRESS_STORAGE_KEY]: rawValue })).load()).toEqual({ a: result });
  });

  it('não quebra quando o armazenamento está bloqueado', () => {
    const progress = createLocalStorageProgress(brokenStorage);

    expect(progress.load()).toEqual({});
    expect(() => progress.save({ a: result })).not.toThrow();
  });
});

describe('createLocalStorageTutorial', () => {
  it('lembra que o tutorial já foi visto', () => {
    const tutorial = createLocalStorageTutorial(createFakeStorage());

    expect(tutorial.hasSeen()).toBe(false);
    tutorial.markSeen();
    expect(tutorial.hasSeen()).toBe(true);
  });

  it('só considera visto o valor esperado', () => {
    expect(createLocalStorageTutorial(createFakeStorage({ [TUTORIAL_STORAGE_KEY]: 'talvez' })).hasSeen()).toBe(false);
  });

  it('não quebra quando o armazenamento está bloqueado', () => {
    const tutorial = createLocalStorageTutorial(brokenStorage);

    expect(tutorial.hasSeen()).toBe(false);
    expect(() => tutorial.markSeen()).not.toThrow();
  });
});
