import { apiRequest } from '#/lib/http'
import { authResponseSchema } from '../schemas'
import type { AuthResponse, RegisterInput } from '../types'

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: input,
    schema: authResponseSchema,
  })
}
