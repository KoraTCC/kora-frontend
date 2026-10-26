import type { z } from 'zod'
import type {
  checkoutSchema,
  checkoutSearchSchema,
  checkoutStatusSchema,
} from './schemas'

export type Checkout = z.infer<typeof checkoutSchema>
export type CheckoutStatus = z.infer<typeof checkoutStatusSchema>
export type CheckoutSearch = z.infer<typeof checkoutSearchSchema>
export type PaymentMethod = NonNullable<CheckoutSearch['method']>
