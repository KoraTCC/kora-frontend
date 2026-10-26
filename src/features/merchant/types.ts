import type { z } from 'zod'
import type { FieldErrors } from '#/lib/formErrors'
import type { merchantProfileFormSchema, merchantSchema } from './schemas'

export type Merchant = z.infer<typeof merchantSchema>
export type MerchantProfileFormValues = z.infer<
  typeof merchantProfileFormSchema
>
export type MerchantProfileField = keyof MerchantProfileFormValues
export type MerchantProfileFieldErrors = FieldErrors<MerchantProfileField>
