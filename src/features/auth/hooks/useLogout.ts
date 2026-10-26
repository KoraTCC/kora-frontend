import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AUTH_USER_QUERY_KEY } from '../queries'
import { logout } from '../services/account.service'

/**
 * TODO(api): kora-backend has no /auth/logout yet, so the httpOnly session
 * cookie survives. Locally we forget the user and drop cached data; the real
 * endpoint will clear the cookie.
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, null)
      void navigate({ to: '/auth', replace: true })
    },
  })

  return {
    handleLogout: () => mutation.mutate(),
    isLoggingOut: mutation.isPending,
  }
}
