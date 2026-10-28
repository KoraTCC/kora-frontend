import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createApiKey,
  getTestCredentials,
  listApiKeys,
  revokeApiKey,
  rotateSecretKey,
} from '../services/apiKeys.service'

const API_KEYS_KEY = ['api-keys'] as const

export function useApiKeys() {
  return useQuery({ queryKey: API_KEYS_KEY, queryFn: listApiKeys })
}

export function useTestCredentials() {
  return useQuery({
    queryKey: [...API_KEYS_KEY, 'test'],
    queryFn: getTestCredentials,
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: API_KEYS_KEY }),
  })
}

export function useRotateSecretKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rotateSecretKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: API_KEYS_KEY }),
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: API_KEYS_KEY }),
  })
}
