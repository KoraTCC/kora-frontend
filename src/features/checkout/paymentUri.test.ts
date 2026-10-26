import { describe, expect, it } from 'vitest'
import { buildPaymentUri, toBaseUnits } from './paymentUri'

describe('toBaseUnits', () => {
  it('converts decimal strings without floating point drift', () => {
    expect(toBaseUnits('0.0384', 18)).toBe('38400000000000000')
    expect(toBaseUnits('16.42', 6)).toBe('16420000')
    expect(toBaseUnits('1', 8)).toBe('100000000')
    expect(toBaseUnits('0.1', 18)).toBe('100000000000000000')
  })
})

describe('buildPaymentUri', () => {
  it('uses EIP-681 with the chain id on EVM networks', () => {
    expect(buildPaymentUri('sepolia', '0xabc', '0.0384')).toBe(
      'ethereum:0xabc@11155111?value=38400000000000000',
    )
  })

  it('uses BIP-21 on Bitcoin', () => {
    expect(buildPaymentUri('bitcoin-testnet', 'tb1qxyz', '0.00071')).toBe(
      'bitcoin:tb1qxyz?amount=0.00071',
    )
  })
})
