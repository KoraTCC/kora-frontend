import { Card } from '#/components/ui/Card'
import { Input } from '#/components/ui/Input'
import { PillGroup } from '#/components/ui/PillGroup'
import { Select } from '#/components/ui/Select'
import { useRequestLogs } from '../hooks/useRequestLogs'
import {
  HTTP_METHODS,
  STATUS_CLASSES,
  httpMethodSchema,
  statusClassSchema,
} from '../schemas'
import type { LogsSearch } from '../types'
import { RequestKpis } from './RequestKpis'
import { RequestLogsTable } from './RequestLogsTable'

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  ...STATUS_CLASSES.map((value) => ({ value, label: value })),
]

const METHOD_OPTIONS = [
  { value: '', label: 'Método' },
  ...HTTP_METHODS.map((value) => ({ value, label: value })),
]

type RequestLogsViewProps = {
  search: LogsSearch
  onSearchChange: (next: LogsSearch) => void
}

export function RequestLogsView({
  search,
  onSearchChange,
}: RequestLogsViewProps) {
  const query = useRequestLogs({
    statusClass: search.statusClass,
    method: search.method,
    q: search.q,
    page: search.page ?? 1,
    pageSize: PAGE_SIZE,
  })

  function handleStatusChange(value: string) {
    const parsed = statusClassSchema.safeParse(value)
    onSearchChange({
      ...search,
      statusClass: parsed.success ? parsed.data : undefined,
      page: undefined,
    })
  }

  function handleMethodChange(value: string) {
    const parsed = httpMethodSchema.safeParse(value)
    onSearchChange({
      ...search,
      method: parsed.success ? parsed.data : undefined,
      page: undefined,
    })
  }

  function handleQueryChange(value: string) {
    onSearchChange({ ...search, q: value || undefined, page: undefined })
  }

  return (
    <>
      <RequestKpis />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <PillGroup
          label="Filtrar por status HTTP"
          options={STATUS_OPTIONS}
          value={search.statusClass ?? 'all'}
          onChange={handleStatusChange}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            label="Buscar rota"
            isLabelHidden
            type="search"
            placeholder="Buscar rota…"
            defaultValue={search.q}
            onChange={(event) => handleQueryChange(event.target.value)}
          />
          <Select
            label="Método"
            isLabelHidden
            size="sm"
            options={METHOD_OPTIONS}
            value={search.method ?? ''}
            onChange={(event) => handleMethodChange(event.target.value)}
            className="sm:w-32"
          />
        </div>
      </div>
      <Card isFlush>
        <RequestLogsTable
          query={query}
          onPageChange={(page) => onSearchChange({ ...search, page })}
        />
      </Card>
    </>
  )
}
