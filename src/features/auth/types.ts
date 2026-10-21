import type { z } from 'zod'
import type {
  authResponseSchema,
  registerFormSchema,
  registerSchema,
  userSchema,
} from './schemas'

export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>

export type RegisterField = keyof RegisterFormValues
export type RegisterFieldErrors = Partial<Record<RegisterField, string>>
