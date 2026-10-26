import type { z } from 'zod'
import type {
  adminMerchantSchema,
  adminRangeSchema,
  auditEntrySchema,
  auditPageSchema,
  auditSearchSchema,
  globalChargeSchema,
  globalChargesSchema,
  globalChargesSearchSchema,
  incidentSchema,
  merchantPageSchema,
  merchantStatusSchema,
  merchantsSearchSchema,
  monitoringSchema,
  overviewSchema,
  serviceHealthSchema,
} from './schemas'

export type AdminRange = z.infer<typeof adminRangeSchema>
export type AdminMerchant = z.infer<typeof adminMerchantSchema>
export type MerchantStatus = z.infer<typeof merchantStatusSchema>
export type MerchantPage = z.infer<typeof merchantPageSchema>
export type ServiceHealth = z.infer<typeof serviceHealthSchema>
export type Incident = z.infer<typeof incidentSchema>
export type AuditEntry = z.infer<typeof auditEntrySchema>
export type AuditPage = z.infer<typeof auditPageSchema>
export type Overview = z.infer<typeof overviewSchema>
export type GlobalCharge = z.infer<typeof globalChargeSchema>
export type GlobalCharges = z.infer<typeof globalChargesSchema>
export type Monitoring = z.infer<typeof monitoringSchema>

export type MerchantsSearch = z.infer<typeof merchantsSearchSchema>
export type GlobalChargesSearch = z.infer<typeof globalChargesSearchSchema>
export type AuditSearch = z.infer<typeof auditSearchSchema>
