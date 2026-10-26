import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { LiveTag } from '#/components/ui/LiveTag'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatRelative } from '#/lib/date'
import { useDashboardOverview } from '../hooks/useDashboardOverview'
import type { DashboardEvent } from '../types'

const DOT_CLASSES: Record<DashboardEvent['tone'], string> = {
  confirmed: 'bg-status-confirmed',
  detected: 'bg-status-detected',
  failed: 'bg-status-failed',
  pending: 'bg-status-pending',
}

export function RecentEventsCard() {
  const { data, isPending, isError, refetch } = useDashboardOverview('7d')

  return (
    <Card title="Eventos recentes" action={<LiveTag />}>
      <RecentEventsBody
        events={data?.events}
        isPending={isPending}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </Card>
  )
}

type RecentEventsBodyProps = {
  events?: ReadonlyArray<DashboardEvent>
  isPending: boolean
  isError: boolean
  onRetry: () => void
}

function RecentEventsBody({
  events,
  isPending,
  isError,
  onRetry,
}: RecentEventsBodyProps) {
  if (isPending) return <Skeleton lines={4} />
  if (isError || !events) return <ErrorState onRetry={onRetry} />
  if (!events.length)
    return <p className="text-muted text-xs">Nenhum evento ainda.</p>

  return (
    <ul className="flex flex-col gap-3.5">
      {events.map((event) => (
        <li key={event.id} className="flex gap-2.5">
          <span
            aria-hidden
            className={`mt-1.5 size-1.5 flex-none rounded-full ${DOT_CLASSES[event.tone]}`}
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-ink text-xs">{event.title}</p>
            <p className="text-dim font-mono text-[10px]">
              {event.detail} · {formatRelative(event.at)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
