import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { ChargeStatusBadge } from '#/features/charges/components/ChargeStatusBadge'
import { formatAssetNetwork } from '#/features/networks/networks'
import { formatBRL } from '#/lib/money'
import type { GlobalCharge } from '../types'

const COLUMNS: Array<Column<GlobalCharge>> = [
  {
    key: 'id',
    header: 'ID',
    cell: (charge) => (
      <span className="text-ink font-mono text-xs">{charge.id}</span>
    ),
  },
  {
    key: 'merchant',
    header: 'Lojista',
    cell: (charge) => (
      <span className="flex flex-col">
        <span className="text-ink text-[13px]">{charge.merchantName}</span>
        <span className="text-dim font-mono text-[10px]">
          {charge.merchantId}
        </span>
      </span>
    ),
  },
  {
    key: 'amount',
    header: 'Valor',
    cell: (charge) => (
      <span className="text-ink font-mono text-xs">
        {formatBRL(charge.amountCents)}
      </span>
    ),
  },
  {
    key: 'asset',
    header: 'Ativo',
    cell: (charge) => (
      <span className="text-muted font-mono text-[11px]">
        {formatAssetNetwork(charge.network)}
      </span>
    ),
  },
  {
    key: 'tx',
    header: 'Transação',
    cell: (charge) => (
      <span className="text-dim font-mono text-[11px]">{charge.txHash}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (charge) => <ChargeStatusBadge status={charge.status} />,
  },
]

export function GlobalChargesTable({
  charges,
}: {
  charges: ReadonlyArray<GlobalCharge>
}) {
  return (
    <DataTable
      caption="Cobranças da plataforma"
      columns={COLUMNS}
      rows={charges}
      getRowKey={(charge) => charge.id}
      minWidth={760}
    />
  )
}
