import { useQuery } from '@tanstack/react-query'
import { networkSettingsQueryOptions, walletsQueryOptions } from '../queries'

export function useWallets() {
  return useQuery(walletsQueryOptions)
}

export function useNetworkSettings() {
  return useQuery(networkSettingsQueryOptions)
}
