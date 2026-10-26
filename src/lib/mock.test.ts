import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ApiError } from './http'
import { mockRequest } from './mock'

const schema = z.object({ ok: z.literal(true) })

describe('mockRequest', () => {
  it('resolves with the response validated by the schema', async () => {
    await expect(
      mockRequest('/thing', { schema, response: { ok: true }, latencyMs: 0 }),
    ).resolves.toEqual({ ok: true })
  })

  it('rejects with ApiError when the response breaks the schema', async () => {
    await expect(
      mockRequest('/thing', { schema, response: { ok: 1 }, latencyMs: 0 }),
    ).rejects.toBeInstanceOf(ApiError)
  })
})
