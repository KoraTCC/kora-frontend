import { z } from 'zod'

// Espelha `@kora/contracts` (kora-backend/packages/contracts/src/auth.ts).
export const PASSWORD_MIN_LENGTH = 12
export const PASSWORD_MAX_LENGTH = 128

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('E-mail inválido').max(254, 'E-mail muito longo'))

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `A senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres`,
  )

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Nome muito curto')
  .max(100, 'Nome muito longo')

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

// Espelha `loginSchema`: no login a senha só tem limite de tamanho.
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Informe a senha')
    .max(PASSWORD_MAX_LENGTH, 'Senha inválida'),
})

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, 'Aceite os termos para continuar'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  })

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  twoFactorEnabled: z.boolean().default(false),
})

export const authResponseSchema = z.object({
  user: userSchema,
})

/** With 2FA on, the right password is not enough: the API asks for the code. */
export const twoFactorRequiredSchema = z.object({
  twoFactorRequired: z.literal(true),
})

export const loginResponseSchema = z.union([
  authResponseSchema,
  twoFactorRequiredSchema,
])

/** `204 No Content`: `apiRequest` reads the missing body as `null`. */
export const noContentSchema = z.null()

export const TWO_FACTOR_CODE_LENGTH = 6

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  })

export const twoFactorSchema = z.object({
  code: z
    .string()
    .regex(
      new RegExp(`^\\d{${TWO_FACTOR_CODE_LENGTH}}$`),
      `Digite os ${TWO_FACTOR_CODE_LENGTH} dígitos do código`,
    ),
})

export const twoFactorStatusSchema = z.object({
  enabled: z.boolean(),
  enabledAt: z.string().nullable(),
  recoveryCodesLeft: z.number(),
})

export const twoFactorSetupSchema = z.object({
  /** Base32 key, for typing into the app when the QR code can't be scanned. */
  secret: z.string(),
  /** What the QR code encodes — `otpauth://totp/...`. */
  otpauthUri: z.string(),
})

/** Shown once: the API only keeps their hashes. */
export const recoveryCodesSchema = z.object({
  recoveryCodes: z.array(z.string()),
})

/** App code (6 digits) or recovery code — the API tells them apart. */
export const twoFactorCredentialSchema = z
  .string()
  .trim()
  .regex(
    /^(\d{6}|[a-z2-9]{4}-?[a-z2-9]{4})$/i,
    'Use o código do app ou um código de recuperação',
  )

export const disableTwoFactorFormSchema = z.object({
  password: z.string().min(1, 'Informe a senha'),
  code: twoFactorCredentialSchema,
})

/** One-time backup code shown when 2FA was turned on — `abcd-2345`. */
export const recoveryCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[a-z2-9]{4}-?[a-z2-9]{4}$/i, 'Use o formato xxxx-xxxx'),
})

export const acknowledgementSchema = z.object({
  ok: z.literal(true),
})

export const emailVerificationSchema = z.object({
  status: z.enum(['pending', 'verified']),
})

// Search params: an invalid value falls back to "absent" instead of throwing.
export const loginSearchSchema = z.object({
  step: z.enum(['two-factor']).optional().catch(undefined),
})

export const resetPasswordSearchSchema = z.object({
  token: z.string().min(1).optional().catch(undefined),
  email: z.string().optional().catch(undefined),
})

export const verifyEmailSearchSchema = z.object({
  email: z.string().optional().catch(undefined),
})
