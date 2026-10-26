import { ChevronDown } from 'lucide-react'
import { useMerchant } from '../hooks/useMerchant'

/** Store switcher placeholder: name + id of the current merchant. */
export function MerchantAccountCard() {
  const { data: merchant, isPending, isError } = useMerchant()

  if (isPending) {
    return (
      <div className="bg-surface border-line h-[53px] animate-pulse rounded-[10px] border" />
    )
  }
  if (isError) {
    return (
      <p className="text-status-failed px-1.5 text-xs">Loja indisponível</p>
    )
  }

  return (
    <div className="bg-surface border-line flex items-center justify-between gap-2 rounded-[10px] border px-3 py-2.5">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-ink truncate text-xs font-semibold">
          {merchant.name}
        </p>
        <p className="text-muted font-mono text-[10px]">ID {merchant.id}</p>
      </div>
      <ChevronDown size={12} aria-hidden className="text-dim flex-none" />
    </div>
  )
}
