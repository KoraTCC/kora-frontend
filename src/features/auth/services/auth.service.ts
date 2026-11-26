import { ApiError, apiRequest } from '#/lib/http'
import {
  authResponseSchema,
  loginResponseSchema,
  noContentSchema,
} from '../schemas'
import type {
  AuthResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
  User,
} from '../types'

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: input,
    schema: authResponseSchema,
  })
}

/** `{ user }`, or `{ twoFactorRequired }` when the account has 2FA on. */
export function login(input: LoginInput): Promise<LoginResponse> {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: input,
    schema: loginResponseSchema,
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
