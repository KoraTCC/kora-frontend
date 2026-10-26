import { Link } from '@tanstack/react-router'
import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { formatAge } from '#/lib/date'
import { formatBRL } from '#/lib/money'
import { formatAssetNetwork } from '#/features/networks/networks'
import type { Charge } from '../types'
import { ChargeStatusBadge } from './ChargeStatusBadge'

type ChargesTableProps = {
  charges: ReadonlyArray<Charge>
  /** `compact` drops customer and confirmations — dashboard card. */
  variant?: 'full' | 'compact'
}

const ID_COLUMN: Column<Charge> = {
  key: 'id',
  header: 'ID',
  cell: (charge) => (
    <Link
      to="/charges/$chargeId"
      params={{ chargeId: charge.id }}
      className="text-ink hover:text-lime font-mono text-xs"
    >
      {charge.id}
    </Link>
  ),
}

const COLUMNS: Record<string, Column<Charge>> = {
  reference: {
    key: 'reference',
    header: 'Pedido',
    cell: (charge) => <span className="text-ink">{charge.reference}</span>,
  },
  customer: {
    key: 'customer',
    header: 'Cliente',
    cell: (charge) => (
      <span className="text-muted font-mono text-[11px]">
        {charge.customerEmail ?? '—'}
      </span>
    ),
  },
  amount: {
    key: 'amount',
    header: 'Valor',
    cell: (charge) => (
      <span className="text-ink font-mono text-xs">
        {formatBRL(charge.amountCents)}
      </span>
    ),
  },
  asset: {
    key: 'asset',
    header: 'Ativo',
    cell: (charge) => (
      <span className="text-muted font-mono text-[11px]">
        {formatAssetNetwork(charge.network)}
      </span>
    ),
  },
  confirmations: {
    key: 'confirmations',
    header: 'Confirmações',
    cell: (charge) => (
      <span className="text-muted font-mono text-[11px]">
        {formatConfirmations(charge)}
      </span>
    ),
  },
  status: {
    key: 'status',
    header: 'Status',
    cell: (charge) => (
      <ChargeStatusBadge status={charge.status} variant="plain" />
    ),
  },
  age: {
    key: 'age',
    header: 'Idade',
    cell: (charge) => (
      <span className="text-dim font-mono text-[11px]">
        {formatAge(charge.createdAt)}
      </span>
    ),
  },
}

const FULL_COLUMNS = [
  ID_COLUMN,
  COLUMNS.reference,
  COLUMNS.customer,
  COLUMNS.amount,
  COLUMNS.asset,
  COLUMNS.confirmations,
  COLUMNS.status,
  COLUMNS.age,
]

const COMPACT_COLUMNS = [
  ID_COLUMN,
  COLUMNS.reference,
  COLUMNS.amount,
  COLUMNS.asset,
  COLUMNS.status,
  COLUMNS.age,
]

export function ChargesTable({ charges, variant = 'full' }: ChargesTableProps) {
  const isCompact = variant === 'compact'
  const columns = isCompact ? COMPACT_COLUMNS : FULL_COLUMNS
  const minWidth = isCompact ? 640 : 900

  return (
    <DataTable
      caption="Cobranças"
      columns={columns}
      rows={charges}
      getRowKey={(charge) => charge.id}
      minWidth={minWidth}
    />
  )
}

function formatConfirmations(charge: Charge): string {
  if (charge.status === 'expired') return '—'
  return `${charge.confirmations}/${charge.requiredConfirmations}`
}
