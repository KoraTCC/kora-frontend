import { describe, expect, it } from 'vitest'
import {
  formatBRL,
  formatBRLCompact,
  formatCrypto,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from './money'

// Intl uses a non-breaking space after "R$"; normalise it for readable asserts.
const plain = (value: string) => value.replace(/\u00a0/g, ' ')

describe('money', () => {
  it('formats cents as BRL', () => {
    expect(plain(formatBRL(24_900))).toBe('R$ 249,00')
    expect(plain(formatBRL(4_198_250))).toBe('R$ 41.982,50')
  })

  it('formats large BRL amounts compactly', () => {
    expect(plain(formatBRLCompact(48_600_000))).toBe('R$ 486 mil')
  })

  it('formats integers and percentages in pt-BR', () => {
    expect(formatNumber(1284)).toBe('1.284')
    expect(plain(formatPercent(0.987))).toBe('98,7%')
    expect(plain(formatSignedPercent(0.082))).toBe('+8,2%')
    expect(plain(formatSignedPercent(-0.01))).toBe('-1,0%')
  })

  it('formats crypto with a decimal comma', () => {
    expect(formatCrypto('0.0184', 'ETH')).toBe('0,0184 ETH')
  })
})
