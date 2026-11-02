import { z } from 'zod'

const DEFAULT_API_URL = 'http://localhost:3333'

const runtimeConfigSchema = z.object({
  apiUrl: z.url().optional(),
})

/**
 * API base URL, without a trailing slash. Precedence: the runtime config
 * (`/config.js`, written by the Docker image on start) → `VITE_API_URL` at
 * build time → local default. An invalid runtime value is ignored.
 */
export function resolveApiUrl(
  runtimeConfig: unknown,
  buildTimeUrl?: string,
): string {
  const parsed = runtimeConfigSchema.safeParse(runtimeConfig)
  const runtimeUrl = parsed.success ? parsed.data.apiUrl : undefined
  return (runtimeUrl ?? buildTimeUrl ?? DEFAULT_API_URL).replace(/\/$/, '')
}
