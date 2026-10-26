import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { EmptyState } from '#/components/ui/EmptyState'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import {
  useRemoveTeamMember,
  useTeamMembers,
} from '../hooks/useSettingsQueries'
import type { TeamMember } from '../types'
import { InviteMemberDialog } from './InviteMemberDialog'
import { TeamMemberRow } from './TeamMemberRow'

export function TeamMembersCard() {
  const { data: members, isPending, isError, refetch } = useTeamMembers()
  const remove = useRemoveTeamMember()
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  return (
    <Card
      title="Membros"
      isFlush
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsInviteOpen(true)}
        >
          + Convidar
        </Button>
      }
    >
      <TeamMembersBody
        members={members}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onRemove={(id) => remove.mutate(id)}
      />
      <InviteMemberDialog
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </Card>
  )
}

type TeamMembersBodyProps = {
  members?: ReadonlyArray<TeamMember>
  isPending: boolean
  isError: boolean
  onRetry: () => void
  onRemove: (memberId: string) => void
}

function TeamMembersBody({
  members,
  isPending,
  isError,
  onRetry,
  onRemove,
}: TeamMembersBodyProps) {
  if (isPending)
    return (
      <div className="p-4">
        <Skeleton lines={6} />
      </div>
    )
  if (isError || !members)
    return (
      <div className="p-4">
        <ErrorState onRetry={onRetry} />
      </div>
    )
  if (!members.length)
    return (
      <EmptyState
        title="Só você por aqui"
        description="Convide quem cuida das cobranças e da integração."
      />
    )

  return (
    <ul>
      {members.map((member) => (
        <TeamMemberRow key={member.id} member={member} onRemove={onRemove} />
      ))}
    </ul>
  )
}
