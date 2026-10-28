import { apiRequest } from '#/lib/http'
import { mockRequest } from '#/lib/mock'
import {
  chargeDetailSchema,
  chargePageSchema,
  chargeStatsSchema,
  createdChargeSchema,
  acknowledgementSchema,
} from '../schemas'
import type {
  ChargeDetail,
  ChargeListParams,
  ChargePage,
  ChargeStats,
  CreateChargeInput,
  SimulationOutcome,
} from '../types'

export function listCharges(params: ChargeListParams): Promise<ChargePage> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  })
  if (params.status) query.set('status', params.status)
  if (params.network) query.set('network', params.network)
  if (params.q) query.set('q', params.q)

  return apiRequest(`/charges?${query.toString()}`, {
    schema: chargePageSchema,
  })
}

export function getChargeStats(): Promise<ChargeStats> {
  return apiRequest('/charges/stats', { schema: chargeStatsSchema })
}

export function getCharge(chargeId: string): Promise<ChargeDetail> {
  return apiRequest(`/charges/${encodeURIComponent(chargeId)}`, {
    schema: chargeDetailSchema,
  })
}

export function createCharge(
  input: CreateChargeInput,
): Promise<{ id: string }> {
  return apiRequest('/charges', {
    method: 'POST',
    body: input,
    schema: createdChargeSchema,
  })
}

/** Test mode only: stands in for on-chain detection until it exists. */
export function simulateChargePayment(
  chargeId: string,
  outcome: SimulationOutcome,
): Promise<{ ok: true }> {
  return apiRequest(`/charges/${encodeURIComponent(chargeId)}/simulate`, {
    method: 'POST',
    body: { outcome },
    schema: acknowledgementSchema,
  })
}

// TODO(api): webhook delivery does not exist in kora-backend yet.
export function resendChargeWebhook(chargeId: string): Promise<{ ok: true }> {
  return mockRequest(`/charges/${chargeId}/webhooks/resend`, {
    method: 'POST',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}
