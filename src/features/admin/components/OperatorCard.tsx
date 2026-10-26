import { ChevronDown } from 'lucide-react'
import { useCurrentUser } from '#/features/auth/hooks/useCurrentUser'

/** Who is operating — the admin counterpart of the merchant account card. */
export function OperatorCard() {
  const { data: user } = useCurrentUser()

  return (
    <div className="bg-surface border-line flex items-center justify-between gap-2 rounded-[10px] border px-3 py-2.5">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-ink truncate text-xs font-semibold">Operador</p>
        <p className="text-muted truncate font-mono text-[10px]">
          {user?.email ?? '—'}
        </p>
      </div>
      <ChevronDown size={12} aria-hidden className="text-dim flex-none" />
    </div>
  )
}
