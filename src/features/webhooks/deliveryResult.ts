import type { StatusTone } from '#/components/ui/StatusBadge'
import type { DeliveryResult } from './types'

export const DELIVERY_RESULT_META: Record<
  DeliveryResult,
  { label: string; tone: StatusTone }
> = {
  success: { label: 'Sucesso', tone: 'confirmed' },
  failed: { label: 'Falha', tone: 'failed' },
  retrying: { label: 'Em retentativa', tone: 'pending' },
}

/** `200 OK`, `502`, `429` — success codes get their reason phrase like in Figma. */
export function formatResponse(statusCode: number): string {
  return statusCode === 200 ? '200 OK' : String(statusCode)
}
