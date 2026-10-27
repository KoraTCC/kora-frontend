import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AUTH_USER_QUERY_KEY } from '../queries'
import { logout } from '../services/auth.service'

/**
 * Ends the session on the API (it clears the httpOnly cookies), then forgets
 * the user and every cached query locally. The local part runs even if the
 * request fails, so the screen never keeps showing private data.
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
