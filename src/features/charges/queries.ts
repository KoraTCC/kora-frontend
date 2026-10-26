import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import {
  getCharge,
  getChargeStats,
  listCharges,
} from './services/charges.service'
import type { ChargeListParams } from './types'

export const chargeKeys = {
  all: ['charges'] as const,
  list: (params: ChargeListParams) => ['charges', 'list', params] as const,
  stats: ['charges', 'stats'] as const,
  detail: (chargeId: string) => ['charges', 'detail', chargeId] as const,
}

export function chargeListQueryOptions(params: ChargeListParams) {
  return queryOptions({
    queryKey: chargeKeys.list(params),
    queryFn: () => listCharges(params),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  })
}

export const chargeStatsQueryOptions = queryOptions({
  queryKey: chargeKeys.stats,
  queryFn: getChargeStats,
})

export function chargeDetailQueryOptions(chargeId: string) {
  return queryOptions({
    queryKey: chargeKeys.detail(chargeId),
    queryFn: () => getCharge(chargeId),
  })
}
