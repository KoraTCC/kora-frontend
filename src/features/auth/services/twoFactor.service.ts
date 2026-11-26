import { apiRequest } from '#/lib/http'
import {
  acknowledgementSchema,
  recoveryCodesSchema,
  twoFactorSetupSchema,
  twoFactorStatusSchema,
} from '../schemas'
import type { RecoveryCodes, TwoFactorSetup, TwoFactorStatus } from '../types'

export function getTwoFactorStatus(): Promise<TwoFactorStatus> {
  return apiRequest('/auth/2fa', { schema: twoFactorStatusSchema })
}

/** Step 1: a pending secret for the QR code — 2FA is not on yet. */
export function startTwoFactorSetup(): Promise<TwoFactorSetup> {
  return apiRequest('/auth/2fa/setup', {
    method: 'POST',
    schema: twoFactorSetupSchema,
  })
}

/** Step 2: the first app code turns 2FA on and returns the recovery codes. */
export function enableTwoFactor(input: {
  code: string
}): Promise<RecoveryCodes> {
  return apiRequest('/auth/2fa/enable', {
    method: 'POST',
    body: input,
    schema: recoveryCodesSchema,
  })
}

export function disableTwoFactor(input: {
  password: string
  code: string
}): Promise<{ ok: true }> {
  return apiRequest('/auth/2fa/disable', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
  })
}

export function regenerateRecoveryCodes(input: {
  code: string
}): Promise<RecoveryCodes> {
  return apiRequest('/auth/2fa/recovery-codes', {
    method: 'POST',
    body: input,
    schema: recoveryCodesSchema,
  })
}
