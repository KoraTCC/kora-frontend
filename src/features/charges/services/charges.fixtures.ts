import { NETWORK_META } from '#/features/networks/networks'
import type { Network } from '#/features/networks/networks'
import { CHARGE_ORIGIN_LABELS } from '../chargeStatus'
import { estimateCryptoAmount } from '../quote'
import type { Charge, ChargeDetail, ChargeStatus } from '../types'

const MINUTE_MS = 60_000

type ChargeTemplate = {
  id: string
  reference: string
  origin: Charge['origin']
  customer: string
  amountCents: number
  network: Network
  status: ChargeStatus
  minutesAgo: number
}

// The first rows mirror the Figma screens; the rest are generated around them.
const FEATURED: Array<ChargeTemplate> = [
  {
    id: 'ch_8f21a4',
    reference: 'Pedido #10482',
    origin: 'order',
    customer: 'maria@exemplo.com',
    amountCents: 24_900,
    network: 'sepolia',
    status: 'confirmed',
    minutesAgo: 2,
  },
  {
    id: 'ch_71bd09',
    reference: 'Pedido #10481',
    origin: 'order',
    customer: 'joao.p@exemplo.com',
    amountCents: 8_900,
    network: 'amoy',
    status: 'pending',
    minutesAgo: 6,
  },
  {
    id: 'ch_5ac733',
    reference: 'Link de pagto',
    origin: 'payment-link',
    customer: 'contato@vertt.com',
    amountCents: 129_000,
    network: 'sepolia',
    status: 'detected',
    minutesAgo: 14,
  },
  {
    id: 'ch_2de480',
    reference: 'Pedido #10479',
    origin: 'order',
    customer: 'lucia.m@exemplo.com',
    amountCents: 34_990,
    network: 'bitcoin-testnet',
    status: 'partial',
    minutesAgo: 38,
  },
  {
    id: 'ch_9b1e57',
    reference: 'Link de pagto',
    origin: 'payment-link',
    customer: 'rafa@exemplo.com',
    amountCents: 5_900,
    network: 'amoy',
    status: 'expired',
    minutesAgo: 62,
  },
  {
    id: 'ch_44c0a2',
    reference: 'Pedido #10477',
    origin: 'order',
    customer: 'bruno@exemplo.com',
    amountCents: 78_000,
    network: 'sepolia',
    status: 'confirmed',
    minutesAgo: 70,
  },
  {
    id: 'ch_c39f81',
    reference: 'API · loja',
    origin: 'api',
    customer: 'ana.s@exemplo.com',
    amountCents: 13_240,
    network: 'amoy',
    status: 'confirmed',
    minutesAgo: 125,
  },
  {
    id: 'ch_18ea6d',
    reference: 'Pedido #10475',
    origin: 'order',
    customer: 'pedro@exemplo.com',
    amountCents: 240_000,
    network: 'bitcoin-testnet',
    status: 'failed',
    minutesAgo: 190,
  },
]

const NAMES = [
  'carla',
  'diego',
  'sofia',
  'tiago',
  'renata',
  'marcos',
  'julia',
  'felipe',
  'bia',
  'leo',
]
const NETWORK_CYCLE: Array<Network> = [
  'sepolia',
  'amoy',
  'sepolia',
  'bitcoin-testnet',
]
// Weighted so the totals land near the Figma KPIs (mostly confirmed).
const STATUS_CYCLE: Array<ChargeStatus> = [
  'confirmed',
  'confirmed',
  'confirmed',
  'confirmed',
  'expired',
  'confirmed',
  'confirmed',
  'pending',
  'confirmed',
  'confirmed',
  'confirmed',
  'expired',
]
const TOTAL_CHARGES = 148

const CONFIRMATION_PROGRESS: Record<ChargeStatus, number> = {
  pending: 0,
  detected: 0.25,
  confirmed: 1,
  partial: 1,
  expired: 0,
  failed: 0,
}

function generateTemplates(): Array<ChargeTemplate> {
  const generated = Array.from(
    { length: TOTAL_CHARGES - FEATURED.length },
    (_, index): ChargeTemplate => {
      const order = 10_474 - index
      const origin = (['order', 'api', 'payment-link'] as const)[index % 3]
      const reference =
        origin === 'order' ? `Pedido #${order}` : CHARGE_ORIGIN_LABELS[origin]
      return {
        id: `ch_${(0x7f20b5 - index * 4099).toString(16).slice(-6)}`,
        reference,
        origin,
        customer: `${NAMES[index % NAMES.length]}${index}@exemplo.com`,
        amountCents: 4_500 + ((index * 7919) % 180_000),
        network: NETWORK_CYCLE[index % NETWORK_CYCLE.length],
        status: STATUS_CYCLE[index % STATUS_CYCLE.length],
        minutesAgo: 200 + index * 65,
      }
    },
  )
  return [...FEATURED, ...generated]
}

function toCharge(template: ChargeTemplate, now: number): Charge {
  const meta = NETWORK_META[template.network]
  const confirmations = Math.round(
    meta.requiredConfirmations * CONFIRMATION_PROGRESS[template.status],
  )
  return {
    id: template.id,
    reference: template.reference,
    origin: template.origin,
    customerEmail: template.customer,
    description: 'Camiseta Kora · tamanho M',
    amountCents: template.amountCents,
    cryptoAmount: estimateCryptoAmount(template.amountCents, template.network),
    asset: meta.asset,
    network: template.network,
    status: template.status,
    confirmations,
    requiredConfirmations: meta.requiredConfirmations,
    createdAt: new Date(now - template.minutesAgo * MINUTE_MS).toISOString(),
  }
}

/** Built once per page load so "há 2 min" stays relative to now. */
export const CHARGES_FIXTURE: Array<Charge> = generateTemplates().map(
  (template) => toCharge(template, Date.now()),
)

export function buildChargeDetail(charge: Charge): ChargeDetail {
  const createdAt = new Date(charge.createdAt).getTime()
  const at = (minutes: number) =>
    new Date(createdAt + minutes * MINUTE_MS).toISOString()
  const isPaid =
    charge.status === 'confirmed' ||
    charge.status === 'detected' ||
    charge.status === 'partial'
  const isConfirmed = charge.status === 'confirmed'

  return {
    ...charge,
    address: '0x7a3f9b2c4e81d55a06f39b7710c8d419c21f',
    txHash: isPaid ? '0x91be44ad0c7f2e6318bb59d0a4c7715e2f80d3ca' : null,
    blockNumber: isConfirmed ? 6_482_119 : null,
    receivedCryptoAmount: isPaid ? charge.cryptoAmount : null,
    lockedRateCents: 1_353_260,
    tolerance: 0.01,
    expiresAt: charge.status === 'pending' ? at(30) : null,
    timeline: [
      {
        id: 'created',
        title: 'Cobrança criada',
        at: at(0),
        detail: `via API`,
        state: 'done',
      },
      {
        id: 'address',
        title: 'Endereço gerado',
        at: at(0),
        detail: `0x7a3f9b2c…d419c21f · ${NETWORK_META[charge.network].label}`,
        state: 'done',
      },
      {
        id: 'detected',
        title: 'Pagamento detectado na mempool',
        at: at(1),
        detail: `${charge.cryptoAmount} ${charge.asset}`,
        state: isPaid ? 'done' : 'pending',
      },
      {
        id: 'confirmed',
        title: `Confirmado · ${charge.confirmations} de ${charge.requiredConfirmations} confirmações`,
        at: at(3),
        detail: `bloco 6.482.119`,
        state: isConfirmed ? 'done' : 'pending',
      },
      {
        id: 'webhook',
        title: 'Webhook charge.confirmed entregue',
        at: at(3),
        detail: `HTTP 200 · 142 ms · 1ª tentativa`,
        state: isConfirmed ? 'done' : 'pending',
      },
    ],
    webhookAttempts: isConfirmed
      ? [
          {
            id: 'wh_1',
            event: 'charge.created',
            statusCode: 200,
            latencyMs: 88,
          },
          {
            id: 'wh_2',
            event: 'charge.detected',
            statusCode: 200,
            latencyMs: 118,
          },
          {
            id: 'wh_3',
            event: 'charge.confirmed',
            statusCode: 200,
            latencyMs: 142,
          },
        ]
      : [
          {
            id: 'wh_1',
            event: 'charge.created',
            statusCode: 200,
            latencyMs: 88,
          },
        ],
    reconciliation: {
      rateAtCreationCents: 1_353_260,
      rateAtConfirmationCents: isConfirmed ? 1_360_110 : null,
      networkFee: isConfirmed ? '0.00021' : null,
      netAmount: isConfirmed ? '0.01819' : null,
    },
  }
}
