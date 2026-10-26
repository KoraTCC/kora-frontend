import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { formatRelative } from '#/lib/date'
import {
  useEndOtherSessions,
  useEndSession,
  useSessions,
} from '../hooks/useSettingsQueries'

export function SessionsCard() {
  const sessions = useSessions()
  const endSession = useEndSession()
  const endOthers = useEndOtherSessions()

  return (
    <Card
      title="Sessões ativas"
      isFlush
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => endOthers.mutate()}
          disabled={endOthers.isPending}
        >
          Encerrar todas
        </Button>
      }
    >
      <SessionsBody
        sessions={sessions}
        onEnd={(sessionId) => endSession.mutate(sessionId)}
      />
    </Card>
  )
}

type SessionsBodyProps = {
  sessions: ReturnType<typeof useSessions>
  onEnd: (sessionId: string) => void
}

function SessionsBody({ sessions, onEnd }: SessionsBodyProps) {
  if (sessions.isPending)
    return (
      <div className="p-4">
        <Skeleton lines={3} />
      </div>
    )
  if (sessions.isError)
    return (
      <div className="p-4">
        <ErrorState onRetry={() => void sessions.refetch()} />
      </div>
    )

  return (
    <ul>
      {sessions.data.map((session) => (
        <li
          key={session.id}
          className="border-line-soft flex items-center justify-between gap-3 border-t px-4 py-3.5 first:border-t-0 sm:px-[18px]"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-ink text-[13px]">{session.device}</span>
              {session.isCurrent ? (
                <StatusBadge tone="confirmed">Esta sessão</StatusBadge>
              ) : null}
            </p>
            <p className="text-dim truncate font-mono text-[10px]">
              {session.location} · {session.ip} ·{' '}
              {formatRelative(session.lastActiveAt)}
            </p>
          </div>
          {session.isCurrent ? null : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEnd(session.id)}
            >
              Encerrar
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
