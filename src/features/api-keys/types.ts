import type { z } from 'zod'
import type { apiKeySchema, testCredentialsSchema } from './schemas'

export type ApiKey = z.infer<typeof apiKeySchema>
export type TestCredentials = z.infer<typeof testCredentialsSchema>
