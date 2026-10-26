import { mockRequest } from '#/lib/mock'
import { acknowledgementSchema, merchantSchema } from '../schemas'
import type { Merchant, MerchantProfileFormValues } from '../types'
import { MERCHANT_FIXTURE } from './merchant.fixtures'

// TODO(api): kora-backend has no merchant endpoints yet; see src/lib/mock.ts.

export function getMerchant(): Promise<Merchant> {
  return mockRequest('/merchants/me', {
    schema: merchantSchema,
    response: MERCHANT_FIXTURE,
  })
}

export function updateMerchantProfile(
  input: MerchantProfileFormValues,
): Promise<{ ok: true }> {
  return mockRequest('/merchants/me', {
    method: 'PATCH',
    body: input,
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}
