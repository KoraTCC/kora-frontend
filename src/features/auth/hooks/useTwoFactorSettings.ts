import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AUTH_USER_QUERY_KEY } from '../queries'
import {
  disableTwoFactor,
  enableTwoFactor,
  getTwoFactorStatus,
  regenerateRecoveryCodes,
  startTwoFactorSetup,
} from '../services/twoFactor.service'

const TWO_FACTOR_KEY = ['auth', 'two-factor'] as const

export function useTwoFactorStatus() {
  return useQuery({ queryKey: TWO_FACTOR_KEY, queryFn: getTwoFactorStatus })
}

/** After any change, both the status card and `user.twoFactorEnabled` refresh. */
function useInvalidateTwoFactor() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_KEY }),
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY }),
    ])
}

export function useStartTwoFactorSetup() {
  return useMutation({ mutationFn: startTwoFactorSetup })
}

export function useEnableTwoFactor() {
  const invalidate = useInvalidateTwoFactor()
  return useMutation({ mutationFn: enableTwoFactor, onSuccess: invalidate })
}

export function useDisableTwoFactor() {
  const invalidate = useInvalidateTwoFactor()
  return useMutation({ mutationFn: disableTwoFactor, onSuccess: invalidate })
}

export function useRegenerateRecoveryCodes() {
  const invalidate = useInvalidateTwoFactor()
  return useMutation({
    mutationFn: regenerateRecoveryCodes,
    onSuccess: invalidate,
  })
}
