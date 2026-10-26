import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { PillGroup } from '#/components/ui/PillGroup'
import { SearchBox } from '#/components/ui/SearchBox'
import { GlobalChargesView } from '#/features/admin/components/GlobalChargesView'
import {
  ADMIN_RANGES,
  globalChargesSearchSchema,
} from '#/features/admin/schemas'
import type { AdminRange, GlobalChargesSearch } from '#/features/admin/types'

const RANGE_OPTIONS = ADMIN_RANGES.map((range) => ({
  value: range,
  label: range.toUpperCase(),
}))

export const Route = createFileRoute('/_admin/admin/charges')({
  validateSearch: globalChargesSearchSchema,
  component: AdminChargesPage,
})

function AdminChargesPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleSearchChange(next: GlobalChargesSearch) {
    void navigate({ search: next })
  }

  return (
    <Page
      title="Cobranças globais"
      subtitle="Todas as cobranças da plataforma"
      actions={
        <>
          <div className="w-full sm:w-64">
            <SearchBox
              key={search.q}
              label="Buscar cobranças"
              placeholder="Buscar ID, hash ou lojista…"
              defaultValue={search.q}
              onSearch={(q) =>
                handleSearchChange({
                  ...search,
                  q: q || undefined,
                  page: undefined,
                })
              }
            />
          </div>
          <PillGroup
            label="Período"
            variant="segmented"
            options={RANGE_OPTIONS}
            value={search.range ?? '7d'}
            onChange={(range: AdminRange) =>
              handleSearchChange({ ...search, range })
            }
          />
        </>
      }
    >
      <GlobalChargesView search={search} onSearchChange={handleSearchChange} />
    </Page>
  )
}
