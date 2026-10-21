import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AUTH_USER_QUERY_KEY } from '../queries'
import { register } from '../services/auth.service'

export { AUTH_USER_QUERY_KEY }

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, user)
    },
  })
}
