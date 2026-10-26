import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCheckout, restartCheckout } from '../services/checkout.service'
import type { CheckoutStatus } from '../types'

/** Statuses where nothing else will happen on chain. */
const FINAL_STATUSES: ReadonlyArray<CheckoutStatus> = [
  'confirmed',
  'expired',
  'failed',
]
const POLL_MS = 3000

const checkoutKey = (chargeId: string) => ['checkout', chargeId] as const

/** Polls the charge while the chain can still change it. */
export function useCheckout(chargeId: string) {
  return useQuery({
    queryKey: checkoutKey(chargeId),
    queryFn: () => getCheckout(chargeId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && FINAL_STATUSES.includes(status) ? false : POLL_MS
    },
    retry: false,
  })
}

export function useRestartCheckout(chargeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => restartCheckout(chargeId),
    onSuccess: (checkout) =>
      queryClient.setQueryData(checkoutKey(chargeId), checkout),
  })
}
