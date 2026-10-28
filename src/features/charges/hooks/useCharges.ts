import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { walletsQueryOptions } from '#/features/wallets/queries'
import {
  resendChargeWebhook,
  simulateChargePayment,
} from '../services/charges.service'
import {
  chargeDetailQueryOptions,
  chargeKeys,
  chargeListQueryOptions,
  chargeStatsQueryOptions,
} from '../queries'
import type { ChargeListParams, SimulationOutcome } from '../types'

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

export function useSimulateChargePayment(chargeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (outcome: SimulationOutcome) =>
      simulateChargePayment(chargeId, outcome),
    // Status, KPIs and the wallet's settled total all change.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: chargeKeys.all }),
        queryClient.invalidateQueries({
          queryKey: walletsQueryOptions.queryKey,
        }),
      ]),
  })
}
