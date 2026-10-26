import { Checkbox } from '#/components/ui/Checkbox'
import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { formatAge } from '#/lib/date'
import { formatBRL, formatNumber, formatPercent } from '#/lib/money'
import { MERCHANT_STATUS_META, PLAN_LABELS } from '../adminStatus'
import type { AdminMerchant } from '../types'
import { MerchantCell } from './MerchantCell'

type MerchantsTableProps = {
  merchants: ReadonlyArray<AdminMerchant>
  selectedIds: ReadonlySet<string>
  onToggle: (merchantId: string) => void
}

export function MerchantsTable({
  merchants,
  selectedIds,
  onToggle,
}: MerchantsTableProps) {
  const columns: Array<Column<AdminMerchant>> = [
    {
      key: 'select',
      header: 'Selecionar',
      cell: (merchant) => (
        <Checkbox
          label={`Selecionar ${merchant.name}`}
          isLabelHidden
          checked={selectedIds.has(merchant.id)}
          onChange={() => onToggle(merchant.id)}
        />
      ),
    },
    {
      key: 'merchant',
      header: 'Lojista',
      cell: (merchant) => (
        <MerchantCell name={merchant.name} id={merchant.id} />
      ),
      className: 'w-full',
    },
    {
      key: 'plan',
      header: 'Plano',
      cell: (merchant) => (
        <span className="text-muted font-mono text-[10px] uppercase">
          {PLAN_LABELS[merchant.plan]}
        </span>
      ),
    },
    {
      key: 'volume',
      header: 'Volume',
      cell: (merchant) => (
        <span className="text-ink font-mono text-xs">
          {formatBRL(merchant.volumeCents)}
        </span>
      ),
    },
    {
      key: 'charges',
      header: 'Cobranças',
      cell: (merchant) => (
        <span className="text-muted font-mono text-[11px]">
          {formatNumber(merchant.charges)}
        </span>
      ),
    },
    {
      key: 'conversion',
      header: 'Conversão',
      cell: (merchant) => (
        <span className="text-muted font-mono text-[11px]">
          {formatPercent(merchant.conversion)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (merchant) => (
        <StatusBadge tone={MERCHANT_STATUS_META[merchant.status].tone}>
          {MERCHANT_STATUS_META[merchant.status].label}
        </StatusBadge>
      ),
    },
    {
      key: 'seen',
      header: 'Visto',
      cell: (merchant) => (
        <span className="text-dim font-mono text-[11px]">
          {formatAge(merchant.lastSeenAt)}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      caption="Lojistas"
      columns={columns}
      rows={merchants}
      getRowKey={(merchant) => merchant.id}
      minWidth={860}
    />
  )
}
