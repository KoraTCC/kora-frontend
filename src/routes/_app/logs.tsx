import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { RequestLogsView } from '#/features/logs/components/RequestLogsView'
import { logsSearchSchema } from '#/features/logs/schemas'
import type { LogsSearch } from '#/features/logs/types'

export const Route = createFileRoute('/_app/logs')({
  validateSearch: logsSearchSchema,
  component: LogsPage,
})

function LogsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleSearchChange(next: LogsSearch) {
    void navigate({ search: next, replace: true })
  }

  return (
    <Page title="Logs" subtitle="Requisições feitas à API da Kora">
      <RequestLogsView search={search} onSearchChange={handleSearchChange} />
    </Page>
  )
}
