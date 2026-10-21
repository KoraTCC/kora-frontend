import { ApiError, apiRequest } from '#/lib/http'
import { authResponseSchema } from '../schemas'
import type { AuthResponse, RegisterInput, User } from '../types'

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: input,
    schema: authResponseSchema,
  })
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { user } = await apiRequest('/auth/me', {
      schema: authResponseSchema,
    })
    return user
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
