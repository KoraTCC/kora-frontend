import { ApiError } from './http'
import type { ZodType } from 'zod'

const DEFAULT_LATENCY_MS = 600

type MockRequestOptions<T> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  schema: ZodType<T>
  /** What the endpoint will answer — validated by `schema` like a real reply. */
  response: unknown
  latencyMs?: number
}

/**
 * Stand-in for `apiRequest` while an endpoint does not exist in kora-backend.
 * Same signature plus `response`: switching to the real call means renaming
 * the function and deleting `response`. Resolves with schema-validated data
 * and rejects with `ApiError`, exactly like the real client.
 */
export async function mockRequest<T>(
  path: string,
  { schema, response, latencyMs = DEFAULT_LATENCY_MS }: MockRequestOptions<T>,
): Promise<T> {
  await wait(latencyMs)

  const parsed = schema.safeParse(response)
  if (!parsed.success) {
    throw new ApiError(500, `Resposta inesperada da API (${path}).`)
  }
  return parsed.data
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
