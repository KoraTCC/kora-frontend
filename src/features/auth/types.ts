import type { z } from 'zod'
import type { FieldErrors } from '#/lib/formErrors'
import type {
  authResponseSchema,
  loginSchema,
  registerFormSchema,
  registerSchema,
  userSchema,
} from './schemas'

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>

export type RegisterField = keyof RegisterFormValues
export type RegisterFieldErrors = FieldErrors<RegisterField>

export type LoginField = keyof LoginInput
export type LoginFieldErrors = FieldErrors<LoginField>
