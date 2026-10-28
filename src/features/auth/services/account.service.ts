import { ApiError } from '#/lib/http'
import { mockRequest } from '#/lib/mock'
import { acknowledgementSchema, emailVerificationSchema } from '../schemas'
import type {
  EmailVerification,
  ForgotPasswordInput,
  ResetPasswordInput,
  TwoFactorInput,
} from '../types'

/*
 * TODO(api): kora-backend does not expose these flows yet; the paths below are
 * the planned ones. Swapping `mockRequest` for `apiRequest` (and dropping
 * `response`) is the whole migration — hooks and screens stay untouched.
 */

type Acknowledgement = { ok: true }

const OK: Acknowledgement = { ok: true }

/** Mock rule: this code is always rejected, to exercise the error state. */
const REJECTED_TWO_FACTOR_CODE = '000000'

export function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<Acknowledgement> {
  return mockRequest('/auth/password/forgot', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
    response: OK,
  })
}

export function resetPassword(
  input: ResetPasswordInput,
): Promise<Acknowledgement> {
  return mockRequest('/auth/password/reset', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
    response: OK,
  })
}

export async function verifyTwoFactor(
  input: TwoFactorInput,
): Promise<Acknowledgement> {
  const result = await mockRequest('/auth/2fa/verify', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
    response: OK,
  })
  if (input.code === REJECTED_TWO_FACTOR_CODE) {
    const message = 'Código inválido ou expirado.'
    throw new ApiError(400, message, [{ path: 'code', message }])
  }
  return result
}

export function resendTwoFactorCode(): Promise<Acknowledgement> {
  return mockRequest('/auth/2fa/resend', {
    method: 'POST',
    schema: acknowledgementSchema,
    response: OK,
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
