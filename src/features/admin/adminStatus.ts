import type { StatusTone } from '#/components/ui/StatusBadge'
import type { AdminMerchant, Incident, ServiceHealth } from './types'

type StatusMeta = { label: string; tone: StatusTone }

export const MERCHANT_STATUS_META: Record<AdminMerchant['status'], StatusMeta> =
  {
    active: { label: 'Ativo', tone: 'confirmed' },
    attention: { label: 'Atenção', tone: 'partial' },
    review: { label: 'Em análise', tone: 'pending' },
    suspended: { label: 'Suspenso', tone: 'failed' },
  }

export const SERVICE_STATUS_META: Record<ServiceHealth['status'], StatusMeta> =
  {
    ok: { label: 'OK', tone: 'confirmed' },
    degraded: { label: 'Degradado', tone: 'partial' },
  }

export const INCIDENT_STATE_META: Record<Incident['state'], StatusMeta> = {
  investigating: { label: 'Investigando', tone: 'partial' },
  unassigned: { label: 'Sem dono', tone: 'failed' },
}

export const PLAN_LABELS: Record<AdminMerchant['plan'], string> = {
  scale: 'Escala',
  standard: 'Padrão',
  starter: 'Inicial',
}
