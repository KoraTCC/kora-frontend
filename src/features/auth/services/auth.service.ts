import { ApiError, apiRequest } from '#/lib/http'
import { authResponseSchema, noContentSchema } from '../schemas'
import type { AuthResponse, LoginInput, RegisterInput, User } from '../types'

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

/** Revokes the refresh token and clears the session cookies (204). */
export async function logout(): Promise<void> {
  await apiRequest('/auth/logout', { method: 'POST', schema: noContentSchema })
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
