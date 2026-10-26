import type { StatusTone } from '#/components/ui/StatusBadge'
import type { ChargeStatus } from './types'

type ChargeStatusMeta = {
  /** Badge label (rendered uppercase). */
  label: string
  /** Plural, for filters and KPIs — "Confirmadas". */
  plural: string
  tone: StatusTone
}

export const CHARGE_STATUS_META: Record<ChargeStatus, ChargeStatusMeta> = {
  pending: { label: 'Pendente', plural: 'Pendentes', tone: 'pending' },
  detected: { label: 'Detectado', plural: 'Detectadas', tone: 'detected' },
  confirmed: { label: 'Confirmado', plural: 'Confirmadas', tone: 'confirmed' },
  partial: { label: 'Parcial', plural: 'Parciais', tone: 'partial' },
  expired: { label: 'Expirado', plural: 'Expiradas', tone: 'expired' },
  failed: { label: 'Falhou', plural: 'Falhou', tone: 'failed' },
}

export const CHARGE_ORIGIN_LABELS = {
  order: 'Pedido',
  'payment-link': 'Link de pagto',
  api: 'API · loja',
} as const
