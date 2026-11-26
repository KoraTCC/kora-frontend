import { apiRequest } from '#/lib/http'
import { mockRequest } from '#/lib/mock'
import { acknowledgementSchema, emailVerificationSchema } from '../schemas'
import type {
  EmailVerification,
  ForgotPasswordInput,
  ResetPasswordInput,
  TwoFactorInput,
} from '../types'

/*
 * Password reset and 2FA are real. TODO(api): e-mail verification is not in
 * kora-backend yet; its paths below are the planned ones. Swapping
 * `mockRequest` for `apiRequest` (and dropping `response`) is the whole
 * migration — hooks and screens stay untouched.
 */

type Acknowledgement = { ok: true }

const OK: Acknowledgement = { ok: true }

export function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<Acknowledgement> {
  return apiRequest('/auth/password/forgot', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
  })
}

export function resetPassword(
  input: ResetPasswordInput,
): Promise<Acknowledgement> {
  return apiRequest('/auth/password/reset', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
  })
}

/**
 * Second login step. The API knows who is logging in from the short-lived
 * challenge cookie set by `POST /auth/login`; `code` is the 6-digit app code
 * or a recovery code. On success the API sets the session cookies.
 */
export function verifyTwoFactor(
  input: TwoFactorInput,
): Promise<Acknowledgement> {
  return apiRequest('/auth/2fa/verify', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
  })
}

export function resendVerificationEmail(
  email: string,
): Promise<Acknowledgement> {
  return mockRequest('/auth/email/resend', {
    method: 'POST',
    body: { email },
    schema: acknowledgementSchema,
    response: OK,
  })
}

export function getEmailVerification(
  email: string,
): Promise<EmailVerification> {
  return mockRequest(`/auth/email/status?email=${encodeURIComponent(email)}`, {
    schema: emailVerificationSchema,
    response: { status: 'pending' },
  })
}
