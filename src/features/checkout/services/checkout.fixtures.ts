import {
  CHARGES_FIXTURE,
  SAMPLE_ADDRESSES,
} from '#/features/charges/services/charges.fixtures'
import { MOCK_RATES_CENTS } from '#/features/charges/quote'
import { NETWORK_META } from '#/features/networks/networks'
import type { Charge } from '#/features/charges/types'
import type { Checkout, CheckoutStatus } from '../types'

const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const PENDING_FOR_MS = 20 * SECOND_MS
const CONFIRMATION_EVERY_MS = 3 * SECOND_MS
const EXPIRES_AFTER_MS = 14 * MINUTE_MS

const STATUS_FROM_CHARGE: Record<Charge['status'], CheckoutStatus> = {
  pending: 'pending',
  detected: 'detected',
  confirmed: 'confirmed',
  partial: 'detected',
  expired: 'expired',
  failed: 'failed',
}

/**
 * The mock "watches the chain": a pending charge opened here gets detected
 * after 20 s and gains one confirmation every 3 s until it is confirmed.
 */
const openedAt = new Map<string, number>()
/** Charges the customer chose to pay again: they start over as pending. */
const restarted = new Set<string>()

export function resetSimulation(chargeId: string) {
  openedAt.set(chargeId, Date.now())
  restarted.add(chargeId)
}

export function buildCheckout(chargeId: string, now: number): Checkout | null {
  const charge = CHARGES_FIXTURE.find((item) => item.id === chargeId)
  if (!charge) return null

  if (!openedAt.has(chargeId)) openedAt.set(chargeId, now)
  const elapsed = now - (openedAt.get(chargeId) ?? now)
  const progress = simulate(charge, elapsed)
  const detectedAt =
    progress.status === 'pending'
      ? null
      : new Date(now - 60 * SECOND_MS).toISOString()

  return {
    chargeId: charge.id,
    reference: charge.reference,
    status: progress.status,
    amountCents: charge.amountCents,
    cryptoAmount: charge.cryptoAmount,
    asset: charge.asset,
    network: charge.network,
    address: SAMPLE_ADDRESSES[charge.network],
    rateCents: MOCK_RATES_CENTS[charge.network],
    tolerance: 0.01,
    confirmations: progress.confirmations,
    requiredConfirmations: charge.requiredConfirmations,
    createdAt: charge.createdAt,
    expiresAt: new Date(
      (openedAt.get(chargeId) ?? now) + EXPIRES_AFTER_MS,
    ).toISOString(),
    detectedAt,
    txHash: detectedAt ? '0xa41e8c92f0d7b13e6a5c4f2d9b8e7a6c5d43b77bd' : null,
    failureReason: progress.status === 'failed' ? 'Transação revertida' : null,
    merchant: {
      name: 'Loja Exemplo',
      returnUrl: 'https://lojaexemplo.com/pedido',
    },
  }
}

function simulate(
  charge: Charge,
  elapsed: number,
): { status: CheckoutStatus; confirmations: number } {
  const required = NETWORK_META[charge.network].requiredConfirmations
  const initial = restarted.has(charge.id)
    ? 'pending'
    : STATUS_FROM_CHARGE[charge.status]

  if (initial === 'pending' && elapsed < PENDING_FOR_MS)
    return { status: 'pending', confirmations: 0 }
  if (initial !== 'pending' && initial !== 'detected')
    return { status: initial, confirmations: charge.confirmations }

  const sinceDetected =
    initial === 'pending' ? elapsed - PENDING_FOR_MS : elapsed
  const startingAt = Math.max(charge.confirmations, 1)
  const confirmations = Math.min(
    required,
    startingAt + Math.floor(sinceDetected / CONFIRMATION_EVERY_MS),
  )
  const status = confirmations >= required ? 'confirmed' : 'detected'
  return { status, confirmations }
}
