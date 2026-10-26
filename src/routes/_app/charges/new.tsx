import { Link, createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { buttonClasses } from '#/components/ui/Button'
import { CreateChargeView } from '#/features/charges/components/CreateChargeView'

export const Route = createFileRoute('/_app/charges/new')({
  component: NewChargePage,
})

function NewChargePage() {
  return (
    <Page
      title="Nova cobrança"
      subtitle="Gere um link ou um QR para receber em cripto"
      actions={
        <Link
          to="/charges"
          className={buttonClasses({ variant: 'ghost', size: 'sm' })}
        >
          Cancelar
        </Link>
      }
    >
      <CreateChargeView />
    </Page>
  )
}
