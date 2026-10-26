import type { StatusTone } from '#/components/ui/StatusBadge'
import type { TeamMember, TeamRole } from '../types'

export const ROLE_META: Record<TeamRole, { label: string; scope: string }> = {
  owner: { label: 'Dono', scope: 'Tudo, inclusive carteiras' },
  developer: { label: 'Desenvolvedor', scope: 'Chaves, webhooks, logs' },
  finance: { label: 'Financeiro', scope: 'Cobranças e relatórios' },
  viewer: { label: 'Leitura', scope: 'Somente visualização' },
}

export const MEMBER_BADGE: Record<
  TeamMember['status'],
  { tone: StatusTone; label?: string }
> = {
  active: { tone: 'expired' },
  invited: { tone: 'pending', label: 'Convite pendente' },
  inactive: { tone: 'expired', label: 'Inativa' },
}

/** Permission matrix shown under the members list. */
export const PERMISSIONS: ReadonlyArray<{
  id: string
  label: string
  roles: ReadonlyArray<TeamRole>
}> = [
  {
    id: 'view',
    label: 'Ver cobranças',
    roles: ['owner', 'developer', 'finance', 'viewer'],
  },
  {
    id: 'create',
    label: 'Criar cobranças',
    roles: ['owner', 'developer', 'finance'],
  },
  {
    id: 'integrations',
    label: 'Chaves de API e webhooks',
    roles: ['owner', 'developer'],
  },
  { id: 'export', label: 'Exportar relatórios', roles: ['owner', 'finance'] },
  { id: 'wallets', label: 'Carteiras de recebimento', roles: ['owner'] },
  { id: 'team', label: 'Gerenciar equipe', roles: ['owner'] },
]
