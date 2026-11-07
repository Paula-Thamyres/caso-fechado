export function* combinations<Item>(items: readonly Item[], size: number, startIndex = 0): Generator<readonly Item[]> {
  if (size === 0) {
    yield [];
    return;
  }

  for (let index = startIndex; index <= items.length - size; index += 1) {
    const current = items[index] as Item;

    for (const rest of combinations(items, size - 1, index + 1)) {
      yield [current, ...rest];
    }
  }
}
