import { z } from 'zod'

export const apiKeySchema = z.object({
  id: z.string(),
  /** Masked form shown in lists — `sk_test_91be…59d0`. */
  maskedKey: z.string(),
  kind: z.enum(['publishable', 'secret']),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable(),
  callsLast7d: z.number(),
})

export const testCredentialsSchema = z.object({
  publishableKey: z.string(),
  secretKey: z.string(),
})

export const acknowledgementSchema = z.object({ ok: z.literal(true) })

export const createdApiKeySchema = z.object({ secretKey: z.string() })
