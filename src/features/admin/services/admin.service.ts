import { mockRequest } from '#/lib/mock'
import type { ChargeStatus } from '#/features/charges/types'
import {
  acknowledgementSchema,
  auditPageSchema,
  globalChargesSchema,
  merchantPageSchema,
  monitoringSchema,
  overviewSchema,
} from '../schemas'
import type {
  AdminRange,
  AuditPage,
  AuditSearch,
  GlobalCharges,
  GlobalChargesSearch,
  MerchantPage,
  MerchantsSearch,
  Monitoring,
  Overview,
} from '../types'
import {
  AUDIT_ENTRIES,
  GLOBAL_CHARGES,
  INCIDENTS,
  MERCHANTS,
  SERVICES,
  ago,
} from './admin.fixtures'

// TODO(api): kora-backend has no admin endpoints (nor operator roles) yet;
// see src/lib/mock.ts. Filtering happens here only because there is no server.

type Ok = { ok: true }

/** Platform-wide share of charges per status, in display order. */
const STATUS_SHARES: ReadonlyArray<readonly [ChargeStatus, number]> = [
  ['confirmed', 0.62],
  ['pending', 0.14],
  ['detected', 0.09],
  ['expired', 0.08],
  ['partial', 0.04],
  ['failed', 0.03],
]

const CHARGES_PER_DAY = [
  ['22 ago', 512, 74],
  ['23', 478, 135],
  ['24', 526, 49],
  ['25', 461, 188],
  ['26', 560, 31],
  ['27', 499, 112],
  ['28 ago', 571, 0],
] as const

const MULTIPLIER: Record<AdminRange, number> = {
  '24h': 1 / 7,
  '7d': 1,
  '30d': 4.2,
}

export function getOverview(range: AdminRange): Promise<Overview> {
  const scale = MULTIPLIER[range]
  return mockRequest(`/admin/overview?range=${range}`, {
    schema: overviewSchema,
    response: {
      activeMerchants: 42,
      newMerchants: 5,
      volumeCents: Math.round(48_600_000 * scale),
      volumeBreakdown: '≈ 7,42 ETH · 18,4k USDT',
      charges: Math.round(3914 * scale),
      chargesDelta: 0.141,
      confirmedRate: 0.872,
      openIncidents: INCIDENTS.length,
      unassignedIncidents: INCIDENTS.filter(
        (incident) => incident.state === 'unassigned',
      ).length,
      chargesPerDay: CHARGES_PER_DAY.map(([label, confirmed, expired]) => ({
        label,
        confirmed,
        expired,
      })),
      services: SERVICES.slice(0, 4),
      incidents: INCIDENTS,
      recentAudit: AUDIT_ENTRIES.slice(0, 4),
      topMerchants: MERCHANTS.slice(0, 5),
    },
  })
}

export function listAdminMerchants(
  search: MerchantsSearch,
  pageSize: number,
): Promise<MerchantPage> {
  const page = search.page ?? 1
  const needle = search.q?.toLowerCase()
  const matching = MERCHANTS.filter(
    (merchant) =>
      (!search.status || merchant.status === search.status) &&
      (!needle ||
        `${merchant.name} ${merchant.id}`.toLowerCase().includes(needle)),
  )
  const start = (page - 1) * pageSize

  return mockRequest('/admin/merchants', {
    schema: merchantPageSchema,
    response: {
      items: matching.slice(start, start + pageSize),
      page,
      pageSize,
      total: matching.length,
      counts: {
        all: MERCHANTS.length,
        active: MERCHANTS.filter(
          (merchant) =>
            merchant.status === 'active' || merchant.status === 'attention',
        ).length,
        review: MERCHANTS.filter((merchant) => merchant.status === 'review')
          .length,
        suspended: MERCHANTS.filter(
          (merchant) => merchant.status === 'suspended',
        ).length,
      },
    },
  })
}

export function suspendMerchants(
  merchantIds: ReadonlyArray<string>,
): Promise<Ok> {
  return mockRequest('/admin/merchants/suspend', {
    method: 'POST',
    body: { merchantIds },
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function inviteMerchant(input: { email: string }): Promise<Ok> {
  return mockRequest('/admin/merchants/invites', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function listGlobalCharges(
  search: GlobalChargesSearch,
  pageSize: number,
): Promise<GlobalCharges> {
  const page = search.page ?? 1
  const needle = search.q?.toLowerCase()
  const matching = GLOBAL_CHARGES.filter(
    (charge) =>
      (!search.status || charge.status === search.status) &&
      (!search.network || charge.network === search.network) &&
      (!needle ||
        `${charge.id} ${charge.merchantName} ${charge.txHash}`
          .toLowerCase()
          .includes(needle)),
  )
  const start = (page - 1) * pageSize

  return mockRequest('/admin/charges', {
    schema: globalChargesSchema,
    response: {
      items: matching.slice(start, start + pageSize),
      page,
      pageSize,
      total: matching.length,
      stats: {
        total: 3914,
        confirmed: 3412,
        pending: 284,
        pendingAmountCents: 6_120_400,
        anomalies: 9,
      },
      distribution: STATUS_SHARES.map(([status, share]) => ({ status, share })),
      anomalies: [
        {
          id: 'an_1',
          title: 'Pagamento 24% abaixo do cobrado',
          chargeId: 'ch_2ad913',
          merchantId: 'mch_2b74f005',
        },
        {
          id: 'an_2',
          title: 'Transação revertida pela rede',
          chargeId: 'ch_44b1c8',
          merchantId: 'mch_c4820ba7',
        },
        {
          id: 'an_3',
          title: 'Pagamento após a expiração',
          chargeId: 'ch_9e4402',
          merchantId: 'mch_0e51bb47',
        },
      ],
    },
  })
}

export function getMonitoring(): Promise<Monitoring> {
  const hours = Array.from({ length: 24 }, (_, hour) => hour)
  return mockRequest('/admin/monitoring', {
    schema: monitoringSchema,
    response: {
      availability: 0.9982,
      maxBlockLag: 4,
      laggingIndexer: 'btc-indexer',
      webhookQueue: 312,
      webhookRetrying: 2,
      averageLatencyMs: 142,
      p95LatencyMs: 410,
      services: SERVICES,
      latencyByHour: hours.map((hour) => ({
        label: hour === 23 ? 'agora' : `${String(hour).padStart(2, '0')}h`,
        seconds: [
          62, 66, 58, 51, 49, 55, 64, 78, 92, 95, 94, 88, 84, 90, 101, 112, 99,
          86, 80, 83, 94, 81, 74, 70,
        ][hour],
      })),
      incidents: INCIDENTS,
      confirmations: [
        { network: 'sepolia', blocks: 12, eta: '≈ 2 min', isDelayed: false },
        { network: 'amoy', blocks: 30, eta: '≈ 1 min', isDelayed: false },
        {
          network: 'bitcoin-testnet',
          blocks: 3,
          eta: '≈ 48 min',
          isDelayed: true,
        },
      ],
      capacity: [
        {
          id: 'queue',
          label: 'Fila de webhooks',
          used: 312,
          limit: 5000,
          display: '312 / 5k',
        },
        {
          id: 'db',
          label: 'Conexões de banco',
          used: 84,
          limit: 200,
          display: '84 / 200',
        },
        {
          id: 'rate',
          label: 'Rate limit da API',
          used: 61,
          limit: 100,
          display: '61%',
        },
      ],
      lastDeploy: {
        version: 'v1.18.2',
        at: ago(4 * 3_600_000),
        by: 'adm_0014',
      },
    },
  })
}

export function restartService(serviceId: string): Promise<Ok> {
  return mockRequest(`/admin/services/${serviceId}/restart`, {
    method: 'POST',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function listAudit(
  search: AuditSearch,
  pageSize: number,
): Promise<AuditPage> {
  const page = search.page ?? 1
  const needle = search.q?.toLowerCase()
  const matching = AUDIT_ENTRIES.filter(
    (entry) =>
      matchesScope(entry, search.scope) &&
      (!needle ||
        `${entry.actor} ${entry.action} ${entry.target}`
          .toLowerCase()
          .includes(needle)),
  )
  const start = (page - 1) * pageSize

  return mockRequest('/admin/audit', {
    schema: auditPageSchema,
    response: {
      items: matching.slice(start, start + pageSize),
      page,
      pageSize,
      total: matching.length,
      counts: { all: 1902, operators: 1140, system: 762, critical: 38 },
      topActions: [
        { code: 'charge.reprocess', count: 412, isCritical: false },
        { code: 'merchant.update', count: 288, isCritical: false },
        { code: 'apikey.rotate', count: 96, isCritical: false },
        { code: 'merchant.suspend', count: 12, isCritical: true },
      ],
    },
  })
}

function matchesScope(
  entry: AuditPage['items'][number],
  scope: AuditSearch['scope'],
): boolean {
  if (scope === 'operators') return !entry.isSystem
  if (scope === 'system') return entry.isSystem
  if (scope === 'critical') return entry.isCritical
  return true
}
