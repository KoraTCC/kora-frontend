import { Avatar } from '#/components/ui/Avatar'
import { getInitials } from '#/features/auth/initials'

type MerchantCellProps = {
  name: string
  id: string
}

export function MerchantCell({ name, id }: MerchantCellProps) {
  return (
    <span className="flex items-center gap-3">
      <Avatar initials={getInitials(name)} tone="neutral" />
      <span className="flex min-w-0 flex-col">
        <span className="text-ink text-[13px]">{name}</span>
        <span className="text-dim font-mono text-[10px]">{id}</span>
      </span>
    </span>
  )
}
