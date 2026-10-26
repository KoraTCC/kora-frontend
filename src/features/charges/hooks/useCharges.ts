import { useMutation, useQuery } from '@tanstack/react-query'
import { resendChargeWebhook } from '../services/charges.service'
import {
  chargeDetailQueryOptions,
  chargeListQueryOptions,
  chargeStatsQueryOptions,
} from '../queries'
import type { ChargeListParams } from '../types'

export function useChargeList(params: ChargeListParams) {
  return useQuery(chargeListQueryOptions(params))
}

export function useChargeStats() {
  return useQuery(chargeStatsQueryOptions)
}

export function useCharge(chargeId: string) {
  return useQuery(chargeDetailQueryOptions(chargeId))
}

export function useResendChargeWebhook() {
  return useMutation({ mutationFn: resendChargeWebhook })
}
