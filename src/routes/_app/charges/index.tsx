import { Link, createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { buttonClasses } from '#/components/ui/Button'
import { ChargeListView } from '#/features/charges/components/ChargeListView'
import { chargeListSearchSchema } from '#/features/charges/schemas'
import type { ChargeListSearch } from '#/features/charges/types'

export const Route = createFileRoute('/_app/charges/')({
  validateSearch: chargeListSearchSchema,
  component: ChargesPage,
})

function ChargesPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleSearchChange(next: ChargeListSearch) {
    void navigate({ search: next })
  }

  return (
    <Page
      title="Cobranças"
      subtitle="Todas as cobranças da loja"
      actions={
        <Link to="/charges/new" className={buttonClasses({ size: 'sm' })}>
          + Nova cobrança
        </Link>
      }
    >
      <ChargeListView search={search} onSearchChange={handleSearchChange} />
    </Page>
  )
}
