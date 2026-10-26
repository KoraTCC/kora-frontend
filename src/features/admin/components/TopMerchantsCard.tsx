import { Card } from '#/components/ui/Card'
import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { formatAge } from '#/lib/date'
import { formatBRL, formatNumber, formatPercent } from '#/lib/money'
import { MERCHANT_STATUS_META } from '../adminStatus'
import type { AdminMerchant } from '../types'
import { MerchantCell } from './MerchantCell'
import { ViewAllLink } from './ViewAllLink'

const COLUMNS: Array<Column<AdminMerchant>> = [
  {
    key: 'merchant',
    header: 'Lojista',
    cell: (merchant) => <MerchantCell name={merchant.name} id={merchant.id} />,
    className: 'w-full',
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

export function TopMerchantsCard({
  merchants,
}: {
  merchants: ReadonlyArray<AdminMerchant>
}) {
  return (
    <Card
      title="Lojistas por volume"
      isFlush
      action={<ViewAllLink to="/admin/merchants" label="Ver todos" />}
    >
      <DataTable
        caption="Lojistas por volume"
        columns={COLUMNS}
        rows={merchants}
        getRowKey={(merchant) => merchant.id}
        minWidth={720}
      />
    </Card>
  )
}
