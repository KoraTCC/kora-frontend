import { Link, createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { buttonClasses } from '#/components/ui/Button'
import { DeliveryLogView } from '#/features/webhooks/components/DeliveryLogView'
import { deliveryLogSearchSchema } from '#/features/webhooks/schemas'
import type { DeliveryLogSearch } from '#/features/webhooks/types'

export const Route = createFileRoute('/_app/webhooks/logs')({
  validateSearch: deliveryLogSearchSchema,
  component: WebhookLogsPage,
})

function WebhookLogsPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleSearchChange(next: DeliveryLogSearch) {
    void navigate({ search: next })
  }

  return (
    <Page
      title="Entregas de webhook"
      subtitle="https://lojaexemplo.com/kora/hooks"
      actions={
        <Link
          to="/webhooks"
          className={buttonClasses({ variant: 'secondary', size: 'sm' })}
        >
          Voltar
        </Link>
      }
    >
      <DeliveryLogView search={search} onSearchChange={handleSearchChange} />
    </Page>
  )
}
