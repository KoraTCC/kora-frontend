import { z } from 'zod'
import { networkSchema } from '#/features/networks/networks'
import { EXPIRATIONS, TOLERANCES } from '#/features/charges/schemas'

export const SETTINGS_FORM_ID = 'settings-form'

export const acknowledgementSchema = z.object({ ok: z.literal(true) })

export const billingSettingsSchema = z.object({
  defaultTolerance: z.enum(TOLERANCES),
  defaultWindowMinutes: z.enum(EXPIRATIONS),
  referenceCurrency: z.enum(['BRL', 'USD', 'EUR']),
  defaultNetwork: networkSchema,
  acceptOverpayment: z.boolean(),
  autoExpire: z.boolean(),
  sendReceipt: z.boolean(),
  notifyDetected: z.boolean(),
  remindBeforeExpiry: z.boolean(),
  senderEmail: z.string().trim().min(3, 'Informe o remetente'),
  returnUrl: z.url('URL inválida'),
})

export const billingInsightsSchema = z.object({
  total: z.number(),
  withinTolerance: z.number(),
  partial: z.number(),
  expired: z.number(),
  suggestion: z.string(),
  expirationByWindow: z.array(
    z.object({ window: z.enum(EXPIRATIONS), share: z.number() }),
  ),
})

export const TEAM_ROLES = ['owner', 'developer', 'finance', 'viewer'] as const
export const teamRoleSchema = z.enum(TEAM_ROLES)

export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: teamRoleSchema,
  status: z.enum(['active', 'invited', 'inactive']),
  lastActiveAt: z.string().nullable(),
})

export const teamActivitySchema = z.object({
  id: z.string(),
  text: z.string(),
  at: z.string(),
  tone: z.enum(['lime', 'pending']),
})

export const inviteFormSchema = z.object({
  email: z.email('E-mail inválido'),
  role: teamRoleSchema,
})

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  requireTeamTwoFactor: z.boolean(),
  sessionTimeout: z.enum(['1h', '12h', '7d']),
  lockoutAttempts: z.enum(['3', '5', '10']),
  allowedIps: z
    .string()
    .trim()
    .regex(
      /^$|^(\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?)(\s*,\s*\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?)*$/,
      'Use IPs ou faixas CIDR separados por vírgula',
    ),
  notifyNewLocation: z.boolean(),
})

export const sessionSchema = z.object({
  id: z.string(),
  device: z.string(),
  location: z.string(),
  ip: z.string(),
  lastActiveAt: z.string(),
  isCurrent: z.boolean(),
})

export const accessLogSchema = z.object({
  id: z.string(),
  at: z.string(),
  isSuccess: z.boolean(),
  location: z.string(),
})

export const networkSettingsFormSchema = z.object({
  enabledNetworks: z
    .array(networkSchema)
    .min(1, 'Deixe ao menos uma rede ativa'),
})

export const newWalletFormSchema = z.object({
  address: z
    .string()
    .trim()
    .min(26, 'Endereço muito curto')
    .max(90, 'Endereço muito longo'),
  network: networkSchema,
})
