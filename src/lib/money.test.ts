import { describe, expect, it } from 'vitest'
import {
  maskMoney,
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

  describe('maskMoney', () => {
    it.each([
      ['', ''],
      ['2', '0,02'],
      ['24', '0,24'],
      ['249', '2,49'],
      ['24900', '249,00'],
      ['1234567', '12.345,67'],
      ['0005', '0,05'],
    ])('%s → %s', (input, expected) => {
      expect(maskMoney(input)).toBe(expected)
    })

    it('ignores anything that is not a digit', () => {
      expect(maskMoney('R$ 1.2a4,9!0')).toBe('124,90')
    })

    it('reformats an already masked value after a new digit', () => {
      expect(maskMoney('249,001')).toBe('2.490,01')
    })

    it('caps at R$ 99.999.999,99', () => {
      expect(maskMoney('123456789012')).toBe('12.345.678,90')
    })

    it('produces values the create-charge schema accepts', () => {
      expect(maskMoney('1234567')).toMatch(/^\d{1,3}(\.?\d{3})*(,\d{1,2})?$/)
    })
  })
})
