import { mockRequest } from '#/lib/mock'
import {
  acknowledgementSchema,
  apiKeySchema,
  createdApiKeySchema,
  testCredentialsSchema,
} from '../schemas'
import type { ApiKey, TestCredentials } from '../types'

// TODO(api): kora-backend has no API key endpoints yet; see src/lib/mock.ts.

const DAY_MS = 86_400_000
const MINUTE_MS = 60_000

function buildKeys(now: number): Array<ApiKey> {
  return [
    {
      id: 'key_1',
      maskedKey: 'pk_test_4f21…a3f8',
      kind: 'publishable',
      createdAt: new Date(now - 16 * DAY_MS).toISOString(),
      lastUsedAt: new Date(now - 2 * MINUTE_MS).toISOString(),
      callsLast7d: 608,
    },
    {
      id: 'key_2',
      maskedKey: 'sk_test_91be…59d0',
      kind: 'secret',
      createdAt: new Date(now - 16 * DAY_MS).toISOString(),
      lastUsedAt: new Date(now - 2 * MINUTE_MS).toISOString(),
      callsLast7d: 3204,
    },
    {
      id: 'key_3',
      maskedKey: 'sk_test_0a77…1c42',
      kind: 'secret',
      createdAt: new Date(now - 56 * DAY_MS).toISOString(),
      lastUsedAt: null,
      callsLast7d: 0,
    },
  ]
}

export function listApiKeys(): Promise<Array<ApiKey>> {
  return mockRequest('/api-keys', {
    schema: apiKeySchema.array(),
    response: buildKeys(Date.now()),
  })
}

export function getTestCredentials(): Promise<TestCredentials> {
  return mockRequest('/api-keys/test', {
    schema: testCredentialsSchema,
    response: {
      publishableKey: 'pk_test_demo_4f21_a3f8',
      secretKey: 'sk_test_demo_91be_59d0',
    },
  })
}

export function revokeApiKey(keyId: string): Promise<{ ok: true }> {
  return mockRequest(`/api-keys/${keyId}`, {
    method: 'DELETE',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function rotateSecretKey(): Promise<{ ok: true }> {
  return mockRequest('/api-keys/test/rotate', {
    method: 'POST',
    schema: acknowledgementSchema,
    response: { ok: true },
  })
}

export function createApiKey(): Promise<{ secretKey: string }> {
  return mockRequest('/api-keys', {
    method: 'POST',
    body: { kind: 'secret', environment: 'test' },
    schema: createdApiKeySchema,
    response: { secretKey: 'sk_test_demo_c47e_7c90' },
  })
}
