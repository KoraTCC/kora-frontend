import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { Timeline } from '#/components/ui/Timeline'
import { formatRelative } from '#/lib/date'
import { useTeamActivity } from '../hooks/useSettingsQueries'
import { TEAM_ROLES } from '../schemas'
import { ROLE_META } from './teamRoles'

export function TeamAside() {
  const activity = useTeamActivity()

  return (
    <>
      <Card title="Papéis">
        <DescriptionList
          items={TEAM_ROLES.map((role) => ({
            label: ROLE_META[role].label,
            value: ROLE_META[role].scope,
          }))}
        />
      </Card>
      <Card title="Atividade recente">
        <TeamActivityBody activity={activity} />
      </Card>
      <Callout>
        Convites expiram em 7 dias. Membros sem acesso há 90 dias são
        desativados automaticamente.
      </Callout>
    </>
  )
}

function TeamActivityBody({
  activity,
}: {
  activity: ReturnType<typeof useTeamActivity>
}) {
  if (activity.isPending) return <Skeleton lines={3} />
  if (activity.isError)
    return <ErrorState onRetry={() => void activity.refetch()} />

  return (
    <Timeline
      items={activity.data.map((item) => ({
        id: item.id,
        title: item.text,
        meta: formatRelative(item.at),
        state: item.tone === 'lime' ? 'done' : 'pending',
      }))}
    />
  )
}
