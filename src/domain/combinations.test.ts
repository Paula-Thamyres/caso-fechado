import { describe, expect, it } from 'vitest';
import { combinations } from './combinations';

describe('combinations', () => {
  it('gera todas as combinações do tamanho pedido', () => {
    expect([...combinations(['a', 'b', 'c'], 2)]).toEqual([
      ['a', 'b'],
      ['a', 'c'],
      ['b', 'c'],
    ]);
  });

  it('gera uma combinação vazia quando o tamanho é zero', () => {
    expect([...combinations(['a', 'b'], 0)]).toEqual([[]]);
  });

  it('não gera nada quando o tamanho passa da quantidade de itens', () => {
    expect([...combinations(['a'], 2)]).toEqual([]);
  });
});
