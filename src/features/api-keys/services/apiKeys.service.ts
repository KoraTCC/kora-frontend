import { apiRequest } from '#/lib/http'
import {
  acknowledgementSchema,
  apiKeySchema,
  createdApiKeySchema,
  testCredentialsSchema,
} from '../schemas'
import type { ApiKey, TestCredentials } from '../types'

export function listApiKeys(): Promise<Array<ApiKey>> {
  return apiRequest('/api-keys', { schema: apiKeySchema.array() })
}

/** The secret comes masked: the API only shows it whole once, when created. */
export function getTestCredentials(): Promise<TestCredentials> {
  return apiRequest('/api-keys/test', { schema: testCredentialsSchema })
}

export function revokeApiKey(keyId: string): Promise<{ ok: true }> {
  return apiRequest(`/api-keys/${encodeURIComponent(keyId)}`, {
    method: 'DELETE',
    schema: acknowledgementSchema,
  })
}

/** Revokes the current test secret and returns the new one — shown once. */
export function rotateSecretKey(): Promise<{ secretKey: string }> {
  return apiRequest('/api-keys/test/rotate', {
    method: 'POST',
    schema: createdApiKeySchema,
  })
}

export function createApiKey(): Promise<{ secretKey: string }> {
  return apiRequest('/api-keys', {
    method: 'POST',
    body: { kind: 'secret', environment: 'test' },
    schema: createdApiKeySchema,
  })
}
