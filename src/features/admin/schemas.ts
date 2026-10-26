import { z } from 'zod'
import { chargeStatusSchema } from '#/features/charges/schemas'
import { networkSchema } from '#/features/networks/networks'

export const ADMIN_RANGES = ['24h', '7d', '30d'] as const
export const adminRangeSchema = z.enum(ADMIN_RANGES)

export const MERCHANT_STATUSES = [
  'active',
  'review',
  'suspended',
  'attention',
] as const
export const merchantStatusSchema = z.enum(MERCHANT_STATUSES)

export const adminMerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  plan: z.enum(['scale', 'standard', 'starter']),
  volumeCents: z.number(),
  charges: z.number(),
  conversion: z.number(),
  status: merchantStatusSchema,
  lastSeenAt: z.string(),
})

export const merchantPageSchema = z.object({
  items: z.array(adminMerchantSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  counts: z.record(
    z.enum(['all', 'active', 'review', 'suspended']),
    z.number(),
  ),
})

export const serviceHealthSchema = z.object({
  id: z.string(),
  name: z.string(),
  detail: z.string(),
  status: z.enum(['ok', 'degraded']),
})

export const incidentSchema = z.object({
  id: z.string(),
  title: z.string(),
  at: z.string(),
  reference: z.string(),
  state: z.enum(['investigating', 'unassigned']),
})

export const auditEntrySchema = z.object({
  id: z.string(),
  actor: z.string(),
  isSystem: z.boolean(),
  action: z.string(),
  actionCode: z.string(),
  target: z.string(),
  origin: z.string().nullable(),
  at: z.string(),
  isCritical: z.boolean(),
  payload: z.string(),
})

export const overviewSchema = z.object({
  activeMerchants: z.number(),
  newMerchants: z.number(),
  volumeCents: z.number(),
  volumeBreakdown: z.string(),
  charges: z.number(),
  chargesDelta: z.number(),
  confirmedRate: z.number(),
  openIncidents: z.number(),
  unassignedIncidents: z.number(),
  chargesPerDay: z.array(
    z.object({ label: z.string(), confirmed: z.number(), expired: z.number() }),
  ),
  services: z.array(serviceHealthSchema),
  incidents: z.array(incidentSchema),
  recentAudit: z.array(auditEntrySchema),
  topMerchants: z.array(adminMerchantSchema),
})

export const globalChargeSchema = z.object({
  id: z.string(),
  merchantName: z.string(),
  merchantId: z.string(),
  amountCents: z.number(),
  network: networkSchema,
  txHash: z.string(),
  status: chargeStatusSchema,
})

export const globalChargesSchema = z.object({
  items: z.array(globalChargeSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  stats: z.object({
    total: z.number(),
    confirmed: z.number(),
    pending: z.number(),
    pendingAmountCents: z.number(),
    anomalies: z.number(),
  }),
  distribution: z.array(
    z.object({ status: chargeStatusSchema, share: z.number() }),
  ),
  anomalies: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      chargeId: z.string(),
      merchantId: z.string(),
    }),
  ),
})

export const monitoringSchema = z.object({
  availability: z.number(),
  maxBlockLag: z.number(),
  laggingIndexer: z.string(),
  webhookQueue: z.number(),
  webhookRetrying: z.number(),
  averageLatencyMs: z.number(),
  p95LatencyMs: z.number(),
  services: z.array(serviceHealthSchema),
  latencyByHour: z.array(z.object({ label: z.string(), seconds: z.number() })),
  incidents: z.array(incidentSchema),
  confirmations: z.array(
    z.object({
      network: networkSchema,
      blocks: z.number(),
      eta: z.string(),
      isDelayed: z.boolean(),
    }),
  ),
  capacity: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      used: z.number(),
      limit: z.number(),
      display: z.string(),
    }),
  ),
  lastDeploy: z.object({ version: z.string(), at: z.string(), by: z.string() }),
})

export const auditPageSchema = z.object({
  items: z.array(auditEntrySchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  counts: z.record(
    z.enum(['all', 'operators', 'system', 'critical']),
    z.number(),
  ),
  topActions: z.array(
    z.object({ code: z.string(), count: z.number(), isCritical: z.boolean() }),
  ),
})

export const acknowledgementSchema = z.object({ ok: z.literal(true) })

// --- search params --------------------------------------------------------

const page = z.coerce.number().int().min(1).optional().catch(undefined)
const q = z.string().optional().catch(undefined)

export const overviewSearchSchema = z.object({
  range: adminRangeSchema.optional().catch(undefined),
})

export const merchantsSearchSchema = z.object({
  status: z.enum(['active', 'review', 'suspended']).optional().catch(undefined),
  q,
  page,
})

export const globalChargesSearchSchema = z.object({
  status: chargeStatusSchema.optional().catch(undefined),
  network: networkSchema.optional().catch(undefined),
  range: adminRangeSchema.optional().catch(undefined),
  q,
  page,
})

export const auditSearchSchema = z.object({
  scope: z
    .enum(['operators', 'system', 'critical'])
    .optional()
    .catch(undefined),
  entry: z.string().optional().catch(undefined),
  q,
  page,
})

export const inviteMerchantSchema = z.object({
  email: z.email('E-mail inválido'),
})
