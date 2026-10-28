import type { z } from 'zod'
import type { FieldErrors } from '#/lib/formErrors'
import type { Network } from '#/features/networks/networks'
import type {
  chargeDetailSchema,
  chargeListSearchSchema,
  chargePageSchema,
  chargeSchema,
  chargeStatsSchema,
  chargeStatusSchema,
  createChargeFormSchema,
  SIMULATION_OUTCOMES,
} from './schemas'

export type ChargeStatus = z.infer<typeof chargeStatusSchema>
export type Charge = z.infer<typeof chargeSchema>
export type ChargePage = z.infer<typeof chargePageSchema>
export type ChargeStats = z.infer<typeof chargeStatsSchema>
export type ChargeDetail = z.infer<typeof chargeDetailSchema>
export type ChargeListSearch = z.infer<typeof chargeListSearchSchema>

export type ChargeListParams = {
  status?: ChargeStatus
  network?: Network
  q?: string
  page: number
  pageSize: number
}

export type CreateChargeFormValues = z.infer<typeof createChargeFormSchema>
export type CreateChargeField = keyof CreateChargeFormValues
export type CreateChargeFieldErrors = FieldErrors<CreateChargeField>

export type CreateChargeInput = Omit<CreateChargeFormValues, 'amount'> & {
  amountCents: number
}

export type SimulationOutcome = (typeof SIMULATION_OUTCOMES)[number]
