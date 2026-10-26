import { Avatar } from '#/components/ui/Avatar'
import { Button } from '#/components/ui/Button'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { getInitials } from '#/features/auth/initials'
import { formatRelative } from '#/lib/date'
import type { TeamMember } from '../types'
import { MEMBER_BADGE, ROLE_META } from './teamRoles'

type TeamMemberRowProps = {
  member: TeamMember
  onRemove: (memberId: string) => void
}

export function TeamMemberRow({ member, onRemove }: TeamMemberRowProps) {
  const avatarTone = member.role === 'owner' ? 'lime' : 'neutral'

  return (
    <li className="border-line-soft flex flex-col gap-3 border-t px-4 py-3.5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:px-[18px]">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar initials={getInitials(member.name)} tone={avatarTone} />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="flex flex-wrap items-center gap-2">
            <span className="text-ink text-[13px]">{member.name}</span>
            <MemberBadge member={member} />
          </p>
          <p className="text-dim truncate font-mono text-[10px]">
            {describeMember(member)}
          </p>
        </div>
      </div>
      <MemberActions member={member} onRemove={onRemove} />
    </li>
  )
}

function MemberBadge({ member }: { member: TeamMember }) {
  const badge = MEMBER_BADGE[member.status]
  const tone = member.role === 'owner' ? 'confirmed' : badge.tone
  return (
    <StatusBadge tone={tone}>
      {badge.label ?? ROLE_META[member.role].label}
    </StatusBadge>
  )
}

type MemberActionsProps = {
  member: TeamMember
  onRemove: (memberId: string) => void
}

function MemberActions({ member, onRemove }: MemberActionsProps) {
  if (member.role === 'owner') {
    return (
      <Button variant="secondary" size="sm">
        Gerenciar
      </Button>
    )
  }
  if (member.status === 'invited') {
    return (
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">
          Reenviar
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRemove(member.id)}
        >
          Cancelar
        </Button>
      </div>
    )
  }

  const manageLabel = member.status === 'inactive' ? 'Reativar' : 'Gerenciar'
  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm">
        {manageLabel}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => onRemove(member.id)}>
        Remover
      </Button>
    </div>
  )
}

function describeMember(member: TeamMember): string {
  if (member.status === 'invited') return `${member.email} · convite pendente`
  if (!member.lastActiveAt) return member.email
  if (member.status === 'inactive') {
    return `${member.email} · sem acesso ${formatRelative(member.lastActiveAt)}`
  }
  return `${member.email} · último acesso ${formatRelative(member.lastActiveAt)}`
}
