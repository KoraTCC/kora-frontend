import { apiRequest } from '#/lib/http'
import { authResponseSchema } from '../schemas'
import type { AuthResponse, LoginInput, RegisterInput } from '../types'

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: input,
    schema: authResponseSchema,
  })
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: input,
    schema: authResponseSchema,
  })
}
