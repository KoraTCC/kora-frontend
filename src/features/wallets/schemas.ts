import { z } from 'zod'
import { networkSchema } from '#/features/networks/networks'

export const walletSchema = z.object({
  id: z.string(),
  address: z.string(),
  network: networkSchema,
  status: z.enum(['default', 'active', 'verifying']),
  settledCount: z.number(),
  settledLast7dCents: z.number(),
})

export const walletListSchema = z.array(walletSchema)

export const networkSettingSchema = z.object({
  network: networkSchema,
  isEnabled: z.boolean(),
})

export const networkSettingListSchema = z.array(networkSettingSchema)
