import { apiRequest } from '#/lib/http'
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
  return apiRequest('/settings/billing', { schema: billingSettingsSchema })
}

export function getBillingInsights(): Promise<BillingInsights> {
  return apiRequest('/settings/billing/insights', {
    schema: billingInsightsSchema,
  })
}

export function updateBillingSettings(input: BillingSettings): Promise<Ok> {
  return apiRequest('/settings/billing', {
    method: 'PATCH',
    body: input,
    schema: acknowledgementSchema,
  })
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
  return apiRequest('/sessions', { schema: sessionSchema.array() })
}

export function endSession(sessionId: string): Promise<Ok> {
  return apiRequest(`/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
    schema: acknowledgementSchema,
  })
}

export function endOtherSessions(): Promise<Ok> {
  return apiRequest('/sessions/others', {
    method: 'DELETE',
    schema: acknowledgementSchema,
  })
}

export function listAccessLog(): Promise<Array<AccessLog>> {
  return apiRequest('/security/access-log', { schema: accessLogSchema.array() })
}

export function closeAccount(): Promise<Ok> {
  return save('/merchants/me', undefined, 'DELETE')
}

export function updateNetworkSettings(input: {
  enabledNetworks: Array<string>
}): Promise<Ok> {
  return apiRequest('/networks', {
    method: 'PATCH',
    body: input,
    schema: acknowledgementSchema,
  })
}

export function addWallet(input: {
  address: string
  network: string
}): Promise<Ok> {
  return apiRequest('/wallets', {
    method: 'POST',
    body: input,
    schema: acknowledgementSchema,
  })
}

export function removeWallet(walletId: string): Promise<Ok> {
  return apiRequest(`/wallets/${encodeURIComponent(walletId)}`, {
    method: 'DELETE',
    schema: acknowledgementSchema,
  })
}
