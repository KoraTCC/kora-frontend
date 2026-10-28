import { apiRequest } from '#/lib/http'
import { checkoutSchema } from '../schemas'
import type { Checkout } from '../types'

/** Public route: the payer is not logged in, the link is the access. */
export function getCheckout(chargeId: string): Promise<Checkout> {
  return apiRequest(`/public/checkout/${encodeURIComponent(chargeId)}`, {
    schema: checkoutSchema,
  })
}

/**
 * TODO(api): restarting needs a new charge (new quote, new window), which the
 * API does not do yet — for now this only reloads the current state.
 */
export function restartCheckout(chargeId: string): Promise<Checkout> {
  return getCheckout(chargeId)
}
