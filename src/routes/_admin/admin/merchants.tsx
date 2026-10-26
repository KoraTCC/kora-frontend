import { createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { SearchBox } from '#/components/ui/SearchBox'
import { InviteMerchantButton } from '#/features/admin/components/InviteMerchantButton'
import { MerchantsView } from '#/features/admin/components/MerchantsView'
import { merchantsSearchSchema } from '#/features/admin/schemas'
import type { MerchantsSearch } from '#/features/admin/types'

export const Route = createFileRoute('/_admin/admin/merchants')({
  validateSearch: merchantsSearchSchema,
  component: AdminMerchantsPage,
})

function AdminMerchantsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleSearchChange(next: MerchantsSearch) {
    void navigate({ search: next })
  }

  return (
    <Page
      title="Lojistas"
      subtitle="Contas da plataforma"
      actions={
        <>
          <div className="w-full sm:w-64">
            <SearchBox
              key={search.q}
              label="Buscar lojistas"
              placeholder="Buscar lojista ou ID…"
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
          <InviteMerchantButton />
        </>
      }
    >
      <MerchantsView search={search} onSearchChange={handleSearchChange} />
    </Page>
  )
}
