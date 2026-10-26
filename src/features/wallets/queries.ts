import { queryOptions } from '@tanstack/react-query'
import { listNetworkSettings, listWallets } from './services/wallets.service'

export const walletsQueryOptions = queryOptions({
  queryKey: ['wallets'],
  queryFn: listWallets,
})

export const networkSettingsQueryOptions = queryOptions({
  queryKey: ['networks', 'settings'],
  queryFn: listNetworkSettings,
})
