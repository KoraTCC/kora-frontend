import { queryOptions } from '@tanstack/react-query'
import { getMerchant } from './services/merchant.service'

export const merchantQueryOptions = queryOptions({
  queryKey: ['merchant'],
  queryFn: getMerchant,
  staleTime: 5 * 60_000,
})
