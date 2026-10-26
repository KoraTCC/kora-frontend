import type { z } from 'zod'
import type {
  accessLogSchema,
  billingInsightsSchema,
  billingSettingsSchema,
  securitySettingsSchema,
  sessionSchema,
  teamActivitySchema,
  teamMemberSchema,
  teamRoleSchema,
} from './schemas'

export type BillingSettings = z.infer<typeof billingSettingsSchema>
export type BillingInsights = z.infer<typeof billingInsightsSchema>
export type TeamRole = z.infer<typeof teamRoleSchema>
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamActivity = z.infer<typeof teamActivitySchema>
export type SecuritySettings = z.infer<typeof securitySettingsSchema>
export type Session = z.infer<typeof sessionSchema>
export type AccessLog = z.infer<typeof accessLogSchema>
