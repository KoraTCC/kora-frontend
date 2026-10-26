import type { Merchant } from '../types'

export const MERCHANT_FIXTURE: Merchant = {
  id: 'mch_4f21',
  name: 'Loja Exemplo',
  legalName: 'Loja Exemplo Comércio Digital LTDA',
  document: '41.208.774/0001-06',
  phone: '(11) 94002-8922',
  email: 'contato@lojaexemplo.com',
  website: 'https://lojaexemplo.com',
  createdAt: '2025-08-12T10:00:00.000Z',
  environment: 'test',
  status: 'active',
  checkout: {
    displayName: 'Loja Exemplo',
    showLogo: true,
    showBackButton: true,
  },
  address: {
    postalCode: '01310-100',
    street: 'Av. Paulista, 1578',
    complement: '',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
  },
  plan: {
    name: 'Padrão',
    renewsAt: '2025-09-12T10:00:00.000Z',
    chargesUsed: 148,
    chargesLimit: 500,
    apiCallsUsed: 3812,
    apiCallsLimit: 50000,
    webhookEndpointsUsed: 2,
    webhookEndpointsLimit: 5,
  },
}
