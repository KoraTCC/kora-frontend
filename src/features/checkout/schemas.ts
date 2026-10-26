import { z } from 'zod'
import { assetSchema, networkSchema } from '#/features/networks/networks'

export const CHECKOUT_STATUSES = [
  'pending',
  'detected',
  'confirmed',
  'expired',
  'failed',
] as const
export const checkoutStatusSchema = z.enum(CHECKOUT_STATUSES)

/** What the public payment page may know — no customer data, no merchant internals. */
export const checkoutSchema = z.object({
  chargeId: z.string(),
  reference: z.string(),
  status: checkoutStatusSchema,
  amountCents: z.number(),
  cryptoAmount: z.string(),
  asset: assetSchema,
  network: networkSchema,
  address: z.string(),
  rateCents: z.number(),
  tolerance: z.number(),
  confirmations: z.number(),
  requiredConfirmations: z.number(),
  createdAt: z.string(),
  expiresAt: z.string(),
  detectedAt: z.string().nullable(),
  txHash: z.string().nullable(),
  failureReason: z.string().nullable(),
  merchant: z.object({
    name: z.string(),
    returnUrl: z.string(),
  }),
})

export const checkoutSearchSchema = z.object({
  method: z.enum(['qr', 'address']).optional().catch(undefined),
})
