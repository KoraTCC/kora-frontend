import type { z } from 'zod'
import type { FieldErrors } from '#/lib/formErrors'
import type {
  authResponseSchema,
  emailVerificationSchema,
  forgotPasswordSchema,
  loginResponseSchema,
  loginSchema,
  recoveryCodesSchema,
  registerFormSchema,
  registerSchema,
  resetPasswordFormSchema,
  twoFactorSchema,
  twoFactorSetupSchema,
  twoFactorStatusSchema,
  userSchema,
} from './schemas'

export type LoginInput = z.infer<typeof loginSchema>
/** Body of the captcha-protected routes: the API reads and drops the token. */
export type WithCaptcha<T> = T & { turnstileToken?: string }
export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

export type RegisterField = keyof RegisterFormValues
export type RegisterFieldErrors = FieldErrors<RegisterField>

export type LoginField = keyof LoginInput
export type LoginFieldErrors = FieldErrors<LoginField>

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ForgotPasswordField = keyof ForgotPasswordInput
export type ForgotPasswordFieldErrors = FieldErrors<ForgotPasswordField>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
export type ResetPasswordInput = { token: string; password: string }
export type ResetPasswordField = keyof ResetPasswordFormValues
export type ResetPasswordFieldErrors = FieldErrors<ResetPasswordField>

export type TwoFactorInput = z.infer<typeof twoFactorSchema>

export type EmailVerification = z.infer<typeof emailVerificationSchema>

export type TwoFactorStatus = z.infer<typeof twoFactorStatusSchema>
export type TwoFactorSetup = z.infer<typeof twoFactorSetupSchema>
export type RecoveryCodes = z.infer<typeof recoveryCodesSchema>
