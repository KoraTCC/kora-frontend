import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register } from '../services/auth.service'

export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, user)
    },
  })
}
