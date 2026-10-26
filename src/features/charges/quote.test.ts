import { describe, expect, it } from 'vitest'
import { estimateCryptoAmount, parseBRLAmount } from './quote'

describe('parseBRLAmount', () => {
  it('reads Brazilian money input as cents', () => {
    expect(parseBRLAmount('249,00')).toBe(24_900)
    expect(parseBRLAmount('1.290,5')).toBe(129_050)
    expect(parseBRLAmount('45')).toBe(4_500)
  })

  it('rejects anything that is not an amount', () => {
    expect(parseBRLAmount('abc')).toBeNull()
    expect(parseBRLAmount('1,234')).toBeNull()
  })
})

describe('estimateCryptoAmount', () => {
  it('uses the network decimals', () => {
    expect(estimateCryptoAmount(24_900, 'sepolia')).toBe('0.0184')
    expect(estimateCryptoAmount(8_900, 'amoy')).toBe('16.42')
  })
})
