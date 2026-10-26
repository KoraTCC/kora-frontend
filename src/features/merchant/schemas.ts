import { z } from 'zod'

export const merchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  legalName: z.string(),
  document: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  createdAt: z.string(),
  environment: z.enum(['test', 'live']),
  status: z.enum(['active', 'suspended']),
  checkout: z.object({
    displayName: z.string(),
    showLogo: z.boolean(),
    showBackButton: z.boolean(),
  }),
  address: z.object({
    postalCode: z.string(),
    street: z.string(),
    complement: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
  plan: z.object({
    name: z.string(),
    renewsAt: z.string(),
    chargesUsed: z.number(),
    chargesLimit: z.number(),
    apiCallsUsed: z.number(),
    apiCallsLimit: z.number(),
    webhookEndpointsUsed: z.number(),
    webhookEndpointsLimit: z.number(),
  }),
})

export const merchantProfileFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da loja'),
  legalName: z.string().trim().min(2, 'Informe a razão social'),
  document: z
    .string()
    .trim()
    .regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'CNPJ inválido'),
  phone: z.string().trim().min(8, 'Telefone inválido'),
  email: z.email('E-mail inválido'),
  website: z.url('URL inválida'),
  displayName: z.string().trim().min(2, 'Informe o nome exibido'),
  showLogo: z.boolean(),
  showBackButton: z.boolean(),
  postalCode: z.string().trim().min(8, 'CEP inválido'),
  street: z.string().trim().min(2, 'Informe o logradouro'),
  complement: z.string().trim(),
  city: z.string().trim().min(2, 'Informe a cidade'),
  state: z.string().length(2, 'UF inválida'),
  country: z.string().min(2),
})

export const acknowledgementSchema = z.object({ ok: z.literal(true) })
