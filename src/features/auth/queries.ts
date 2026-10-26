import { queryOptions } from '@tanstack/react-query'
import { getEmailVerification } from './services/account.service'
import { getCurrentUser } from './services/auth.service'

export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const

/** `null` quando não há sessão: não é erro, é o estado "deslogado". */
export const currentUserQueryOptions = queryOptions({
  queryKey: AUTH_USER_QUERY_KEY,
  queryFn: getCurrentUser,
  staleTime: 30_000,
  retry: false,
})

const EMAIL_VERIFICATION_POLL_MS = 5_000

/** Polls until the e-mail is confirmed — the screen updates on its own. */
export function emailVerificationQueryOptions(email: string) {
  return queryOptions({
    queryKey: ['auth', 'email-verification', email],
    queryFn: () => getEmailVerification(email),
    refetchInterval: (query) =>
      query.state.data?.status === 'verified'
        ? false
        : EMAIL_VERIFICATION_POLL_MS,
  })
}
