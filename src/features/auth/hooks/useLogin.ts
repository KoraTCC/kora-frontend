import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../services/auth.service'
import { AUTH_USER_QUERY_KEY } from './useRegister'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, user)
    },
  })
}
