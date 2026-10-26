import type { ReactNode } from 'react'
import { cn } from '#/lib/cn'

export type Column<TRow> = {
  key: string
  header: string
  cell: (row: TRow) => ReactNode
  align?: 'start' | 'end'
  className?: string
}

type DataTableProps<TRow> = {
  /** Read by screen readers only. */
  caption: string
  columns: ReadonlyArray<Column<TRow>>
  rows: ReadonlyArray<TRow>
  getRowKey: (row: TRow) => string
  /** Below this width the table scrolls inside its own box, never the page. */
  minWidth?: number
}

const ALIGN_CLASSES = {
  start: 'text-left',
  end: 'text-right',
} as const

export function DataTable<TRow>({
  caption,
  columns,
  rows,
  getRowKey,
  minWidth = 720,
}: DataTableProps<TRow>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-2/60">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'text-dim px-4 py-2.5 font-mono text-[10px] font-medium tracking-[0.08em] whitespace-nowrap uppercase',
                  ALIGN_CLASSES[column.align ?? 'start'],
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-line-soft border-t">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'text-ink-soft px-4 py-3 text-[13px] whitespace-nowrap',
                    ALIGN_CLASSES[column.align ?? 'start'],
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
