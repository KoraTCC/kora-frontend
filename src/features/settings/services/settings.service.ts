import { mockRequest } from '#/lib/mock'
import {
  accessLogSchema,
  acknowledgementSchema,
  billingInsightsSchema,
  billingSettingsSchema,
  securitySettingsSchema,
  sessionSchema,
  teamActivitySchema,
  teamMemberSchema,
} from '../schemas'
import type {
  AccessLog,
  BillingInsights,
  BillingSettings,
  SecuritySettings,
  Session,
  TeamActivity,
  TeamMember,
  TeamRole,
} from '../types'

// TODO(api): kora-backend has no settings endpoints yet; see src/lib/mock.ts.

type Ok = { ok: true }

const HOUR_MS = 3_600_000
const DAY_MS = 24 * HOUR_MS
const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

function save(
  path: string,
  body: unknown,
  method: 'PATCH' | 'POST' | 'DELETE' = 'PATCH',
): Promise<Ok> {
  return mockRequest(path, {
    method,
    body,
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function getBillingSettings(): Promise<BillingSettings> {
  return mockRequest('/settings/billing', {
    schema: billingSettingsSchema,
    response: {
      defaultTolerance: '0.01',
      defaultWindowMinutes: '30',
      referenceCurrency: 'BRL',
      defaultNetwork: 'sepolia',
      acceptOverpayment: true,
      autoExpire: true,
      sendReceipt: true,
      notifyDetected: true,
      remindBeforeExpiry: false,
      senderEmail: 'Loja Exemplo <pagamentos@lojaexemplo.com>',
      returnUrl: 'https://lojaexemplo.com/pedido/{referencia}',
    },
  })
}

export function getBillingInsights(): Promise<BillingInsights> {
  return mockRequest('/settings/billing/insights', {
    schema: billingInsightsSchema,
    response: {
      total: 148,
      withinTolerance: 145,
      partial: 3,
      expired: 19,
      suggestion:
        'Aumentar a tolerância para ± 2,0% teria evitado 2 das 3 parciais.',
      expirationByWindow: [
        { window: '15', share: 0.24 },
        { window: '30', share: 0.13 },
        { window: '60', share: 0.07 },
      ],
    },
  })
}

export function updateBillingSettings(input: BillingSettings): Promise<Ok> {
  return save('/settings/billing', input)
}

export function listTeamMembers(): Promise<Array<TeamMember>> {
  return mockRequest('/team/members', {
    schema: teamMemberSchema.array(),
    response: [
      {
        id: 'tm_1',
        name: 'Gustavo Melo',
        email: 'contato@lojaexemplo.com',
        role: 'owner',
        status: 'active',
        lastActiveAt: ago(0),
      },
      {
        id: 'tm_2',
        name: 'Ana Lima',
        email: 'ana@lojaexemplo.com',
        role: 'finance',
        status: 'active',
        lastActiveAt: ago(3 * HOUR_MS),
      },
      {
        id: 'tm_3',
        name: 'Rafael Torres',
        email: 'rafael@lojaexemplo.com',
        role: 'developer',
        status: 'invited',
        lastActiveAt: null,
      },
      {
        id: 'tm_4',
        name: 'Camila Souza',
        email: 'camila@lojaexemplo.com',
        role: 'developer',
        status: 'active',
        lastActiveAt: ago(DAY_MS),
      },
      {
        id: 'tm_5',
        name: 'Eduardo Pinto',
        email: 'eduardo@lojaexemplo.com',
        role: 'viewer',
        status: 'active',
        lastActiveAt: ago(12 * DAY_MS),
      },
      {
        id: 'tm_6',
        name: 'Marina Okada',
        email: 'marina@lojaexemplo.com',
        role: 'viewer',
        status: 'inactive',
        lastActiveAt: ago(94 * DAY_MS),
      },
    ],
  })
}

export function listTeamActivity(): Promise<Array<TeamActivity>> {
  return mockRequest('/team/activity', {
    schema: teamActivitySchema.array(),
    response: [
      {
        id: 'ta_1',
        text: 'Ana Lima exportou o relatório de cobranças',
        at: ago(3 * HOUR_MS),
        tone: 'lime',
      },
      {
        id: 'ta_2',
        text: 'Convite enviado para Rafael Torres',
        at: ago(2 * DAY_MS),
        tone: 'pending',
      },
      {
        id: 'ta_3',
        text: 'Gustavo Melo rotacionou a chave secreta',
        at: ago(5 * DAY_MS),
        tone: 'lime',
      },
    ],
  })
}

export function inviteTeamMember(input: {
  email: string
  role: TeamRole
}): Promise<Ok> {
  return save('/team/invites', input, 'POST')
}

export function removeTeamMember(memberId: string): Promise<Ok> {
  return save(`/team/members/${memberId}`, undefined, 'DELETE')
}

export function getSecuritySettings(): Promise<SecuritySettings> {
  return mockRequest('/settings/security', {
    schema: securitySettingsSchema,
    response: {
      twoFactorEnabled: true,
      requireTeamTwoFactor: false,
      sessionTimeout: '12h',
      lockoutAttempts: '5',
      allowedIps: '',
      notifyNewLocation: true,
    },
  })
}

export function updateSecuritySettings(input: SecuritySettings): Promise<Ok> {
  return save('/settings/security', input)
}

export function listSessions(): Promise<Array<Session>> {
  return mockRequest('/sessions', {
    schema: sessionSchema.array(),
    response: [
      {
        id: 'se_1',
        device: 'Chrome · Windows',
        location: 'São Paulo, BR',
        ip: '201.17.44.8',
        lastActiveAt: ago(0),
        isCurrent: true,
      },
      {
        id: 'se_2',
        device: 'Safari · iPhone',
        location: 'São Paulo, BR',
        ip: '189.44.2.130',
        lastActiveAt: ago(6 * HOUR_MS),
        isCurrent: false,
      },
      {
        id: 'se_3',
        device: 'Firefox · Linux',
        location: 'Campinas, BR',
        ip: '177.92.10.4',
        lastActiveAt: ago(2 * DAY_MS),
        isCurrent: false,
      },
    ],
  })
}

export function endSession(sessionId: string): Promise<Ok> {
  return save(`/sessions/${sessionId}`, undefined, 'DELETE')
}

export function endOtherSessions(): Promise<Ok> {
  return save('/sessions/others', undefined, 'DELETE')
}

export function listAccessLog(): Promise<Array<AccessLog>> {
  return mockRequest('/security/access-log', {
    schema: accessLogSchema.array(),
    response: [
      { id: 'al_1', at: ago(HOUR_MS), isSuccess: true, location: 'São Paulo' },
      { id: 'al_2', at: ago(DAY_MS), isSuccess: true, location: 'São Paulo' },
      {
        id: 'al_3',
        at: ago(2 * DAY_MS),
        isSuccess: false,
        location: 'Frankfurt',
      },
      {
        id: 'al_4',
        at: ago(3 * DAY_MS),
        isSuccess: true,
        location: 'São Paulo',
      },
    ],
  })
}

export function closeAccount(): Promise<Ok> {
  return save('/merchants/me', undefined, 'DELETE')
}

export function updateNetworkSettings(input: {
  enabledNetworks: Array<string>
}): Promise<Ok> {
  return save('/networks', input)
}

export function addWallet(input: {
  address: string
  network: string
}): Promise<Ok> {
  return save('/wallets', input, 'POST')
}

export function removeWallet(walletId: string): Promise<Ok> {
  return save(`/wallets/${walletId}`, undefined, 'DELETE')
}
