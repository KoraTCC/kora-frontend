import { Lock } from 'lucide-react'
import { getInitials } from '#/features/auth/initials'

type MerchantBadgeProps = {
  name: string
  /** Shows "protegido por Kora" under the name. */
  isProtectedNoteVisible?: boolean
}

export function MerchantBadge({
  name,
  isProtectedNoteVisible = false,
}: MerchantBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="from-lime-soft to-lime text-on-lime flex size-9 flex-none items-center justify-center rounded-[9px] bg-linear-to-br text-xs font-bold"
      >
        {getInitials(name)}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-ink truncate text-[13px] font-semibold">{name}</p>
        {isProtectedNoteVisible ? (
          <p className="text-dim flex items-center gap-1 font-mono text-[10px]">
            <Lock size={10} aria-hidden /> protegido por Kora
          </p>
        ) : null}
      </div>
    </div>
  )
}
