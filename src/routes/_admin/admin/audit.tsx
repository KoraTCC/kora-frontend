import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { SearchBox } from '#/components/ui/SearchBox'
import { AuditView } from '#/features/admin/components/AuditView'
import { auditSearchSchema } from '#/features/admin/schemas'
import type { AuditSearch } from '#/features/admin/types'

export const Route = createFileRoute('/_admin/admin/audit')({
  validateSearch: auditSearchSchema,
  component: AdminAuditPage,
})

function AdminAuditPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleSearchChange(next: AuditSearch) {
    void navigate({ search: next })
  }

  return (
    <Page
      title="Auditoria"
      subtitle="Registro imutável de ações administrativas"
      actions={
        <div className="w-full sm:w-64">
          <SearchBox
            key={search.q}
            label="Buscar na auditoria"
            placeholder="Buscar ator, ação ou alvo…"
            defaultValue={search.q}
            onSearch={(q) =>
              handleSearchChange({
                ...search,
                q: q || undefined,
                page: undefined,
                entry: undefined,
              })
            }
          />
        </div>
      }
    >
      <AuditView search={search} onSearchChange={handleSearchChange} />
    </Page>
  )
}
