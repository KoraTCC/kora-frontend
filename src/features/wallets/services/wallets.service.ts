import { mockRequest } from '#/lib/mock'
import { networkSettingListSchema, walletListSchema } from '../schemas'
import type { NetworkSetting, Wallet } from '../types'

// TODO(api): kora-backend has no wallet endpoints yet; see src/lib/mock.ts.

const WALLETS: Array<Wallet> = [
  {
    id: 'wal_1',
    address: '0x7a3f9b2c4e81d55a06f39b7710c8d419c21f',
    network: 'sepolia',
    status: 'default',
    settledCount: 128,
    settledLast7dCents: 2_840_000,
  },
  {
    id: 'wal_2',
    address: '0x91be44ad0c7f2e6318bb59d0a4c7715e2f80d3ca',
    network: 'amoy',
    status: 'active',
    settledCount: 41,
    settledLast7dCents: 1_130_000,
  },
  {
    id: 'wal_3',
    address: 'tb1q9x4fz0d8k2m7n3p5r6s8t0v2w4y6a8c7h2ka0',
    network: 'bitcoin-testnet',
    status: 'verifying',
    settledCount: 0,
    settledLast7dCents: 220_000,
  },
]

const NETWORK_SETTINGS: Array<NetworkSetting> = [
  { network: 'sepolia', isEnabled: true },
  { network: 'amoy', isEnabled: true },
  { network: 'bitcoin-testnet', isEnabled: false },
]

export function listWallets(): Promise<Array<Wallet>> {
  return mockRequest('/wallets', {
    schema: walletListSchema,
    response: WALLETS,
  })
}

export function listNetworkSettings(): Promise<Array<NetworkSetting>> {
  return mockRequest('/networks', {
    schema: networkSettingListSchema,
    response: NETWORK_SETTINGS,
  })
}
