import { describe, expect, it } from 'vitest'
import { tokenizeCodeLine } from './codeTokens'

describe('tokenizeCodeLine', () => {
  it('tells keys, strings and numbers apart', () => {
    expect(tokenizeCodeLine('  "amount": 24900,')).toEqual([
      { text: '  ', kind: 'plain' },
      { text: '"amount"', kind: 'key' },
      { text: ':', kind: 'plain' },
      { text: ' ', kind: 'plain' },
      { text: '24900', kind: 'number' },
      { text: ',', kind: 'plain' },
    ])
  })

  it('keeps values as strings', () => {
    const kinds = tokenizeCodeLine('"currency": "BRL"').map(
      (token) => token.kind,
    )
    expect(kinds).toEqual(['key', 'plain', 'plain', 'string'])
  })

  it('leaves digits inside words alone', () => {
    expect(tokenizeCodeLine('POST /v1/charges')).toEqual([
      { text: 'POST /v1/charges', kind: 'plain' },
    ])
  })
})
