import type { z } from 'zod'
import type { networkSettingSchema, walletSchema } from './schemas'

export type Wallet = z.infer<typeof walletSchema>
export type NetworkSetting = z.infer<typeof networkSettingSchema>
