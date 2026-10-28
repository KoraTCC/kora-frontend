import { z } from 'zod'
import { assetSchema, networkSchema } from '#/features/networks/networks'

export const CHARGE_STATUSES = [
  'pending',
  'detected',
  'confirmed',
  'partial',
  'expired',
  'failed',
] as const
export const chargeStatusSchema = z.enum(CHARGE_STATUSES)

export const chargeOriginSchema = z.enum(['order', 'payment-link', 'api'])

export const chargeSchema = z.object({
  id: z.string(),
  reference: z.string(),
  origin: chargeOriginSchema,
  customerEmail: z.string().nullable(),
  description: z.string(),
  amountCents: z.number().int(),
  cryptoAmount: z.string(),
  asset: assetSchema,
  network: networkSchema,
  status: chargeStatusSchema,
  confirmations: z.number().int(),
  requiredConfirmations: z.number().int(),
  createdAt: z.string(),
})

const statusCountsSchema = z.record(chargeStatusSchema, z.number())

export const chargePageSchema = z.object({
  items: z.array(chargeSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalAll: z.number(),
  counts: statusCountsSchema,
})

export const chargeStatsSchema = z.object({
  counts: statusCountsSchema,
  total: z.number(),
  pendingAmountCents: z.number(),
  confirmedDelta: z.number(),
  receivedCents: z.number(),
  receivedDelta: z.number(),
  averageTicketCents: z.number(),
  conversionRate: z.number(),
  medianConfirmMinutes: z.number(),
})

export const chargeEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  at: z.string(),
  detail: z.string(),
  state: z.enum(['done', 'current', 'pending']),
})

export const webhookAttemptSchema = z.object({
  id: z.string(),
  event: z.string(),
  statusCode: z.number(),
  latencyMs: z.number(),
})

export const chargeDetailSchema = chargeSchema.extend({
  address: z.string(),
  txHash: z.string().nullable(),
  blockNumber: z.number().nullable(),
  receivedCryptoAmount: z.string().nullable(),
  lockedRateCents: z.number(),
  tolerance: z.number(),
  expiresAt: z.string().nullable(),
  timeline: z.array(chargeEventSchema),
  webhookAttempts: z.array(webhookAttemptSchema),
  reconciliation: z.object({
    rateAtCreationCents: z.number(),
    rateAtConfirmationCents: z.number().nullable(),
    networkFee: z.string().nullable(),
    netAmount: z.string().nullable(),
  }),
})

// Search params of /charges — invalid values fall back instead of throwing.
export const chargeListSearchSchema = z.object({
  status: chargeStatusSchema.optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
  q: z.string().optional().catch(undefined),
  network: networkSchema.optional().catch(undefined),
})

export const TOLERANCES = ['0.005', '0.01', '0.02', '0'] as const
export const EXPIRATIONS = ['15', '30', '60', '1440'] as const

export const createChargeFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(/^\d{1,3}(\.?\d{3})*(,\d{1,2})?$/, 'Valor inválido — use 249,90'),
  network: networkSchema,
  walletId: z.string().min(1, 'Escolha uma carteira'),
  tolerance: z.enum(TOLERANCES),
  reference: z.string().trim().min(1, 'Informe a referência do pedido'),
  customerEmail: z.union([z.literal(''), z.email('E-mail inválido')]),
  description: z.string().trim().max(120, 'Use até 120 caracteres'),
  expiresInMinutes: z.enum(EXPIRATIONS),
  sendEmail: z.boolean(),
})

export const createdChargeSchema = z.object({ id: z.string() })

// Test mode only: outcomes the API can simulate for a pending charge.
export const SIMULATION_OUTCOMES = ['confirmed', 'partial', 'failed'] as const

export const acknowledgementSchema = z.object({ ok: z.literal(true) })
