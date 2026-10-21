import { queryOptions } from '@tanstack/react-query'
import { getCurrentUser } from './services/auth.service'

export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const

/** `null` quando não há sessão: não é erro, é o estado "deslogado". */
export const currentUserQueryOptions = queryOptions({
  queryKey: AUTH_USER_QUERY_KEY,
  queryFn: getCurrentUser,
  staleTime: 30_000,
  retry: false,
})
