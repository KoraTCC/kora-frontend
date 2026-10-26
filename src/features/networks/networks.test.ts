import { describe, expect, it } from 'vitest'
import { explorerTxUrl, formatAssetNetwork, shortenAddress } from './networks'

describe('networks', () => {
  it('shortens addresses keeping the 0x prefix', () => {
    expect(shortenAddress('0x7a3f9b2c4e81d55a06f39b7710c8d419c21f')).toBe(
      '0x7a3f…c21f',
    )
    expect(shortenAddress('tb1q9x4fz0d8k2m7ka0', 4)).toBe('tb1q…7ka0')
  })

  it('names asset and network together', () => {
    expect(formatAssetNetwork('amoy')).toBe('USDT · Amoy')
  })

  it('builds explorer links per network', () => {
    expect(explorerTxUrl('sepolia', '0xabc')).toBe(
      'https://sepolia.etherscan.io/tx/0xabc',
    )
  })
})
