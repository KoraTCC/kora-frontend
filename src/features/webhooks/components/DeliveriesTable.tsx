import { DataTable } from '#/components/ui/DataTable'
import type { Column } from '#/components/ui/DataTable'
import { formatTime } from '#/lib/date'
import { httpStatusClass } from '#/features/logs/httpStatus'
import { formatResponse } from '../deliveryResult'
import type { WebhookDelivery } from '../types'

const COLUMNS: Array<Column<WebhookDelivery>> = [
  {
    key: 'at',
    header: 'Hora',
    cell: (delivery) => (
      <span className="text-muted font-mono text-[11px]">
        {formatTime(delivery.at)}
      </span>
    ),
  },
  {
    key: 'event',
    header: 'Evento',
    cell: (delivery) => (
      <span className="text-ink font-mono text-[11px]">{delivery.event}</span>
    ),
  },
  {
    key: 'response',
    header: 'Resposta',
    cell: (delivery) => (
      <span
        className={`font-mono text-[11px] ${httpStatusClass(delivery.statusCode)}`}
      >
        {formatResponse(delivery.statusCode)}
      </span>
    ),
  },
  {
    key: 'charge',
    header: 'Cobrança',
    cell: (delivery) => (
      <span className="text-muted font-mono text-[11px]">
        {delivery.chargeId}
      </span>
    ),
  },
  {
    key: 'latency',
    header: 'Latência',
    cell: (delivery) => (
      <span className="text-dim font-mono text-[11px]">
        {formatLatency(delivery.latencyMs)}
      </span>
    ),
  },
  {
    key: 'attempt',
    header: 'Tent.',
    cell: (delivery) => (
      <span className="text-dim font-mono text-[11px]">
        {delivery.attempt}/{delivery.maxAttempts}
      </span>
    ),
  },
]

type DeliveriesTableProps = {
  deliveries: ReadonlyArray<WebhookDelivery>
}

export function DeliveriesTable({ deliveries }: DeliveriesTableProps) {
  return (
    <DataTable
      caption="Tentativas de entrega de webhook"
      columns={COLUMNS}
      rows={deliveries}
      getRowKey={(delivery) => delivery.id}
      minWidth={640}
    />
  )
}

function formatLatency(latencyMs: number): string {
  if (latencyMs < 1000) return `${latencyMs} ms`
  return `${(latencyMs / 1000).toFixed(1)} s`
}
