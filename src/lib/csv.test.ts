import { describe, expect, it } from 'vitest'
import { toCsv } from './csv'

describe('toCsv', () => {
  it('quotes every cell and escapes inner quotes', () => {
    expect(
      toCsv(
        ['id', 'note'],
        [
          ['ch_1', 'diz "oi"'],
          ['ch_2', null],
        ],
      ),
    ).toBe('"id","note"\n"ch_1","diz ""oi"""\n"ch_2",""')
  })
})
