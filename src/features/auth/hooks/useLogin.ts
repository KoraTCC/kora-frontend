import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../services/auth.service'
import { AUTH_USER_QUERY_KEY } from './useRegister'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // With 2FA there is no session yet: the user only exists after the code.
      if ('user' in response)
        queryClient.setQueryData(AUTH_USER_QUERY_KEY, response.user)
    },
  })
}
