import { describe, expect, it } from 'vitest'
import { buildCheckout, resetSimulation } from './checkout.fixtures'

const PENDING_CHARGE = 'ch_71bd09'

describe('checkout simulation', () => {
  it('moves a pending charge to detected and then confirmed over time', () => {
    resetSimulation(PENDING_CHARGE)
    const openedAt = Date.now()

    expect(buildCheckout(PENDING_CHARGE, openedAt)?.status).toBe('pending')
    expect(buildCheckout(PENDING_CHARGE, openedAt + 21_000)?.status).toBe(
      'detected',
    )

    const finished = buildCheckout(
      PENDING_CHARGE,
      openedAt + 20_000 + 30 * 3_000,
    )
    expect(finished?.status).toBe('confirmed')
    expect(finished?.confirmations).toBe(finished?.requiredConfirmations)
  })

  it('keeps final states as they are', () => {
    expect(buildCheckout('ch_18ea6d', Date.now())?.status).toBe('failed')
    expect(buildCheckout('ch_9b1e57', Date.now())?.status).toBe('expired')
  })

  it('starts a failed charge over when the customer retries', () => {
    resetSimulation('ch_18ea6d')
    expect(buildCheckout('ch_18ea6d', Date.now())?.status).toBe('pending')
  })

  it('returns null for unknown charges', () => {
    expect(buildCheckout('ch_nope', Date.now())).toBeNull()
  })
})
