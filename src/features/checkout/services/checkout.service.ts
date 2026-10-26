import { ApiError } from '#/lib/http'
import { mockRequest } from '#/lib/mock'
import { checkoutSchema } from '../schemas'
import type { Checkout } from '../types'
import { buildCheckout, resetSimulation } from './checkout.fixtures'

// TODO(api): kora-backend has no public checkout endpoint yet; see src/lib/mock.ts.

export async function getCheckout(chargeId: string): Promise<Checkout> {
  const checkout = await mockRequest(`/public/checkout/${chargeId}`, {
    schema: checkoutSchema.nullable(),
    response: buildCheckout(chargeId, Date.now()),
    latencyMs: 300,
  })
  if (!checkout) throw new ApiError(404, 'Cobrança não encontrada.')
  return checkout
}

/** Starts the payment over (new quote, new window) after a failure or expiry. */
export async function restartCheckout(chargeId: string): Promise<Checkout> {
  resetSimulation(chargeId)
  return getCheckout(chargeId)
}
