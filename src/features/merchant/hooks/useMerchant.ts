import { useQuery } from '@tanstack/react-query'
import { merchantQueryOptions } from '../queries'

export function useMerchant() {
  return useQuery(merchantQueryOptions)
}
