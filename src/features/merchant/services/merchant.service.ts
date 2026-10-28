import { apiRequest } from '#/lib/http'
import { acknowledgementSchema, merchantSchema } from '../schemas'
import type { Merchant, MerchantProfileFormValues } from '../types'

export function getMerchant(): Promise<Merchant> {
  return apiRequest('/merchants/me', { schema: merchantSchema })
}

export function updateMerchantProfile(
  input: MerchantProfileFormValues,
): Promise<{ ok: true }> {
  return apiRequest('/merchants/me', {
    method: 'PATCH',
    body: input,
    schema: acknowledgementSchema,
  })
}
