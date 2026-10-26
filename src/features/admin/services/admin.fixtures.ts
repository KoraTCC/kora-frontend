import type {
  AdminMerchant,
  AuditEntry,
  GlobalCharge,
  Incident,
  ServiceHealth,
} from '../types'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
export const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

function generatedStatus(index: number): AdminMerchant['status'] {
  if (index < 3) return 'review'
  if (index === 3) return 'suspended'
  return 'active'
}

export const MERCHANTS: Array<AdminMerchant> = [
  {
    id: 'mch_71ad3c92',
    name: 'Mercado Vila',
    plan: 'scale',
    volumeCents: 18_875_000,
    charges: 1204,
    conversion: 0.991,
    status: 'active',
    lastSeenAt: ago(MINUTE_MS),
  },
  {
    id: 'mch_88c02e11',
    name: 'Ateliê Norte',
    plan: 'standard',
    volumeCents: 9_641_000,
    charges: 402,
    conversion: 0.984,
    status: 'active',
    lastSeenAt: ago(9 * MINUTE_MS),
  },
  {
    id: 'mch_4f21a90c',
    name: 'Loja Exemplo',
    plan: 'standard',
    volumeCents: 4_198_200,
    charges: 154,
    conversion: 0.961,
    status: 'active',
    lastSeenAt: ago(2 * MINUTE_MS),
  },
  {
    id: 'mch_9d10a6f3',
    name: 'Casa Prisma',
    plan: 'standard',
    volumeCents: 2_490_000,
    charges: 97,
    conversion: 0.947,
    status: 'active',
    lastSeenAt: ago(18 * MINUTE_MS),
  },
  {
    id: 'mch_2b74f005',
    name: 'Studio Vertt',
    plan: 'standard',
    volumeCents: 1_220_800,
    charges: 61,
    conversion: 0.742,
    status: 'attention',
    lastSeenAt: ago(31 * MINUTE_MS),
  },
  {
    id: 'mch_0e51bb47',
    name: 'Bike Sul',
    plan: 'starter',
    volumeCents: 341_000,
    charges: 18,
    conversion: 0.61,
    status: 'suspended',
    lastSeenAt: ago(4 * HOUR_MS),
  },
  {
    id: 'mch_c4820ba7',
    name: 'Verde Comércio',
    plan: 'starter',
    volumeCents: 874_000,
    charges: 39,
    conversion: 0.82,
    status: 'review',
    lastSeenAt: ago(2 * HOUR_MS),
  },
  {
    id: 'mch_a840f217',
    name: 'Pixel Store',
    plan: 'standard',
    volumeCents: 3_122_000,
    charges: 118,
    conversion: 0.913,
    status: 'active',
    lastSeenAt: ago(44 * MINUTE_MS),
  },
  ...Array.from({ length: 34 }, (_, index): AdminMerchant => ({
    id: `mch_${(0x5a1e00 + index * 7919).toString(16)}`,
    name: `Loja ${['Aurora', 'Brisa', 'Cobalto', 'Duna', 'Esfera', 'Faro', 'Gaia'][index % 7]} ${index + 1}`,
    plan: index % 5 === 0 ? 'scale' : 'standard',
    volumeCents: 200_000 + ((index * 104_729) % 2_000_000),
    charges: 10 + ((index * 37) % 300),
    conversion: 0.8 + ((index * 13) % 19) / 100,
    status: generatedStatus(index),
    lastSeenAt: ago((index + 1) * 47 * MINUTE_MS),
  })),
]

export const SERVICES: Array<ServiceHealth> = [
  {
    id: 'idx-sepolia',
    name: 'Indexador Sepolia',
    detail: 'block 6.481.209 · lag 1 bloco · 18 req/s',
    status: 'ok',
  },
  {
    id: 'idx-amoy',
    name: 'Indexador Amoy',
    detail: 'block 12.904.771 · lag 0 · 24 req/s',
    status: 'ok',
  },
  {
    id: 'idx-btc',
    name: 'Indexador Bitcoin',
    detail: 'block 2.874.001 · lag 4 blocos · reconectando',
    status: 'degraded',
  },
  {
    id: 'webhooks',
    name: 'Fila de webhooks',
    detail: '312 jobs · 2 em retentativa · 142 ms',
    status: 'ok',
  },
  {
    id: 'api',
    name: 'API pública',
    detail: '3.812 req/24h · 0,4% de erro',
    status: 'ok',
  },
]

export const INCIDENTS: Array<Incident> = [
  {
    id: 'inc_1',
    title: 'Indexador Bitcoin atrasado',
    at: ago(2 * HOUR_MS),
    reference: 'btc-indexer · adm_0031',
    state: 'investigating',
  },
  {
    id: 'inc_2',
    title: 'Conversão abaixo de 75%',
    at: ago(25 * MINUTE_MS),
    reference: 'mch_2b74f005',
    state: 'unassigned',
  },
]

const AUDIT_SEEDS: Array<Omit<AuditEntry, 'id' | 'at'>> = [
  {
    actor: 'adm_0031',
    isSystem: false,
    action: 'Suspendeu lojista',
    actionCode: 'merchant.suspend',
    target: 'mch_7ab4',
    origin: '201.17.44.8',
    isCritical: true,
    payload:
      '{\n  "before": { "status": "active" },\n  "after":  { "status": "suspended" },\n  "reason": "conversão abaixo do limite"\n}',
  },
  {
    actor: 'Sistema',
    isSystem: true,
    action: 'Rotacionou chave de API',
    actionCode: 'apikey.rotate',
    target: 'mch_4f21',
    origin: null,
    isCritical: false,
    payload: '{\n  "key": "sk_test_…59d0",\n  "reason": "rotação agendada"\n}',
  },
  {
    actor: 'adm_0014',
    isSystem: false,
    action: 'Aprovou cadastro',
    actionCode: 'merchant.approve',
    target: 'mch_a840',
    origin: '189.44.2.130',
    isCritical: false,
    payload:
      '{\n  "before": { "status": "review" },\n  "after":  { "status": "active" }\n}',
  },
  {
    actor: 'adm_0031',
    isSystem: false,
    action: 'Reprocessou webhook',
    actionCode: 'charge.reprocess',
    target: 'ch_18ea6d',
    origin: '201.17.44.8',
    isCritical: false,
    payload: '{\n  "event": "charge.confirmed",\n  "attempt": 4\n}',
  },
  {
    actor: 'Sistema',
    isSystem: true,
    action: 'Marcou cobrança como expirada',
    actionCode: 'charge.expire',
    target: 'ch_9b1e57',
    origin: null,
    isCritical: false,
    payload: '{\n  "window": 1800\n}',
  },
  {
    actor: 'adm_0014',
    isSystem: false,
    action: 'Alterou tolerância de valor',
    actionCode: 'merchant.update',
    target: 'mch_6e13',
    origin: '189.44.2.130',
    isCritical: false,
    payload:
      '{\n  "before": { "tolerance": 0.01 },\n  "after":  { "tolerance": 0.02 }\n}',
  },
  {
    actor: 'adm_0031',
    isSystem: false,
    action: 'Exportou relatório de volume',
    actionCode: 'report.export',
    target: 'global',
    origin: '201.17.44.8',
    isCritical: false,
    payload: '{\n  "range": "7d"\n}',
  },
  {
    actor: 'Sistema',
    isSystem: true,
    action: 'Bloqueou IP por rate limit',
    actionCode: 'api.block',
    target: 'api',
    origin: null,
    isCritical: true,
    payload: '{\n  "ip": "45.12.9.201",\n  "limit": 600\n}',
  },
]

const AUDIT_OFFSETS = [
  12 * MINUTE_MS,
  40 * MINUTE_MS,
  HOUR_MS,
  2 * HOUR_MS,
  3 * HOUR_MS,
  5 * HOUR_MS,
  DAY_MS,
  DAY_MS + HOUR_MS,
]

export const AUDIT_ENTRIES: Array<AuditEntry> = Array.from(
  { length: 24 },
  (_, index) => ({
    ...AUDIT_SEEDS[index % AUDIT_SEEDS.length],
    id: `aud_${index + 1}`,
    at: ago(AUDIT_OFFSETS[index] ?? (index + 1) * 5 * HOUR_MS),
  }),
)

const NETWORK_CYCLE = [
  'sepolia',
  'sepolia',
  'amoy',
  'sepolia',
  'amoy',
  'sepolia',
  'bitcoin-testnet',
  'sepolia',
] as const
const STATUS_CYCLE = [
  'confirmed',
  'pending',
  'detected',
  'partial',
  'expired',
  'confirmed',
  'failed',
  'confirmed',
] as const

export const GLOBAL_CHARGES: Array<GlobalCharge> = Array.from(
  { length: 40 },
  (_, index) => {
    const merchant = MERCHANTS[index % 8]
    const id = `ch_${(0xa71f04 - index * 3301).toString(16).slice(-6)}`
    return {
      id,
      merchantName: merchant.name,
      merchantId: merchant.id,
      amountCents: 18_900 + ((index * 52_361) % 300_000),
      network: NETWORK_CYCLE[index % NETWORK_CYCLE.length],
      txHash: `0x${id.slice(3)}…c21f`,
      status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    }
  },
)
