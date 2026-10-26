import { Link, createFileRoute } from '@tanstack/react-router'
import { Page } from '#/components/layout/Page'
import { buttonClasses } from '#/components/ui/Button'
import { ChargeDetailView } from '#/features/charges/components/ChargeDetailView'
import { useCharge } from '#/features/charges/hooks/useCharges'
import { formatRelative } from '#/lib/date'

export const Route = createFileRoute('/_app/charges/$chargeId')({
  component: ChargeDetailPage,
})

function ChargeDetailPage() {
  const { chargeId } = Route.useParams()
  const query = useCharge(chargeId)
  const subtitle = query.data
    ? `${query.data.reference} · criada ${formatRelative(query.data.createdAt)}`
    : undefined

  return (
    <Page
      title={chargeId}
      subtitle={subtitle}
      actions={
        <Link
          to="/charges"
          className={buttonClasses({ variant: 'secondary', size: 'sm' })}
        >
          Voltar à lista
        </Link>
      }
    >
      <ChargeDetailView query={query} />
    </Page>
  )
}
