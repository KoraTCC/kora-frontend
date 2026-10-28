import { apiRequest } from '#/lib/http'
import { networkSettingListSchema, walletListSchema } from '../schemas'
import type { NetworkSetting, Wallet } from '../types'

export function listWallets(): Promise<Array<Wallet>> {
  return apiRequest('/wallets', { schema: walletListSchema })
}

export function listNetworkSettings(): Promise<Array<NetworkSetting>> {
  return apiRequest('/networks', { schema: networkSettingListSchema })
}
