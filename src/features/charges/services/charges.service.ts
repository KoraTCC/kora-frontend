import { ApiError } from '#/lib/http'
import { mockRequest } from '#/lib/mock'
import {
  CHARGE_STATUSES,
  chargeDetailSchema,
  chargePageSchema,
  chargeStatsSchema,
  createdChargeSchema,
  acknowledgementSchema,
} from '../schemas'
import type {
  Charge,
  ChargeDetail,
  ChargeListParams,
  ChargePage,
  ChargeStats,
  ChargeStatus,
  CreateChargeInput,
} from '../types'
import { CHARGES_FIXTURE, buildChargeDetail } from './charges.fixtures'

// TODO(api): kora-backend has no charge endpoints yet; see src/lib/mock.ts.
// Filtering and paging happen here only because the mock has no server.

export function listCharges(params: ChargeListParams): Promise<ChargePage> {
  const matching = CHARGES_FIXTURE.filter(
    (charge) =>
      matchesStatus(charge, params.status) &&
      matchesQuery(charge, params.q) &&
      (!params.network || charge.network === params.network),
  )
  const start = (params.page - 1) * params.pageSize

  return mockRequest('/charges', {
    schema: chargePageSchema,
    response: {
      items: matching.slice(start, start + params.pageSize),
      page: params.page,
      pageSize: params.pageSize,
      total: matching.length,
      totalAll: CHARGES_FIXTURE.length,
      counts: countByStatus(CHARGES_FIXTURE),
    },
  })
}

export function getChargeStats(): Promise<ChargeStats> {
  return mockRequest('/charges/stats', {
    schema: chargeStatsSchema,
    response: {
      counts: countByStatus(CHARGES_FIXTURE),
      total: CHARGES_FIXTURE.length,
      pendingAmountCents: 241_800,
      confirmedDelta: 0.124,
      receivedCents: 4_198_250,
      receivedDelta: 0.082,
      averageTicketCents: 32_800,
      conversionRate: 0.872,
      medianConfirmMinutes: 2,
    },
  })
}

export async function getCharge(chargeId: string): Promise<ChargeDetail> {
  const charge = CHARGES_FIXTURE.find((item) => item.id === chargeId)
  const detail = await mockRequest(`/charges/${chargeId}`, {
    schema: chargeDetailSchema.nullable(),
    response: charge ? buildChargeDetail(charge) : null,
  })
  if (!detail) throw new ApiError(404, 'Cobrança não encontrada.')
  return detail
}

export function createCharge(
  input: CreateChargeInput,
): Promise<{ id: string }> {
  return mockRequest('/charges', {
    method: 'POST',
    body: input,
    schema: createdChargeSchema,
    // The mock always "creates" the first fixture so the detail page has data.
    response: { id: CHARGES_FIXTURE[0].id },
  })
}

function matchesStatus(charge: Charge, status?: ChargeStatus): boolean {
  return !status || charge.status === status
}

function matchesQuery(charge: Charge, query?: string): boolean {
  if (!query) return true
  const needle = query.toLowerCase()
  return [charge.id, charge.reference, charge.customerEmail ?? ''].some(
    (field) => field.toLowerCase().includes(needle),
  )
}

function countByStatus(
  charges: ReadonlyArray<Charge>,
): Record<ChargeStatus, number> {
  const counts = Object.fromEntries(
    CHARGE_STATUSES.map((status) => [status, 0]),
  ) as Record<ChargeStatus, number>
  for (const charge of charges) counts[charge.status] += 1
  return counts
}

export function resendChargeWebhook(chargeId: string): Promise<{ ok: true }> {
  return mockRequest(`/charges/${chargeId}/webhooks/resend`, {
    method: 'POST',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}
