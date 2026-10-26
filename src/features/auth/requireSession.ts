import { redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { currentUserQueryOptions } from './queries'

/** Route guard: returns the signed-in user or redirects to `/auth`. */
export async function requireSession(queryClient: QueryClient) {
  const user = await queryClient.fetchQuery(currentUserQueryOptions)
  if (!user) throw redirect({ to: '/auth', replace: true })
  return { user }
}
