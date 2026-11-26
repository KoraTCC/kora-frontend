import { Link } from '@tanstack/react-router'
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
      <Link to="/logs" className="text-lime mt-auto text-xs font-semibold">
        Ver logs →
      </Link>
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
    <ol className="flex flex-col">
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </ol>
  )
}

/** One step of the timeline: dot + rail, title, detail and when. */
function EventItem({ event }: { event: DashboardEvent }) {
  return (
    <li className="group flex gap-3 pb-3.5 last:pb-0">
      <span aria-hidden className="flex flex-col items-center pt-1.5">
        <span
          className={`ring-surface size-2 flex-none rounded-full ring-3 ${DOT_CLASSES[event.tone]}`}
        />
        <span className="bg-line-soft mt-1.5 w-px flex-1 group-last:hidden" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-ink text-[13px] font-semibold">{event.title}</p>
        <p className="text-muted truncate font-mono text-[11px]">
          {event.detail}
        </p>
      </div>
      <span className="text-muted text-xs whitespace-nowrap">
        {formatRelative(event.at)}
      </span>
    </li>
  )
}
