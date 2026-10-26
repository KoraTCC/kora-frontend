import { createFileRoute } from '@tanstack/react-router'
import { CheckoutView } from '#/features/checkout/components/CheckoutView'
import { checkoutSearchSchema } from '#/features/checkout/schemas'
import type { PaymentMethod } from '#/features/checkout/types'

/** Public payment page — no session, no app shell. */
export const Route = createFileRoute('/pay/$chargeId')({
  validateSearch: checkoutSearchSchema,
  head: () => ({ meta: [{ title: 'Pagamento · Kora' }] }),
  component: PayPage,
})

function PayPage() {
  const { chargeId } = Route.useParams()
  const { method = 'qr' } = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleMethodChange(nextMethod: PaymentMethod) {
    void navigate({ search: { method: nextMethod }, replace: true })
  }

  return (
    <main className="bg-canvas text-ink flex min-h-screen items-start justify-center lg:items-center lg:p-10">
      <div className="bg-bg border-line-soft min-h-screen w-full lg:min-h-0 lg:max-w-[1040px] lg:overflow-hidden lg:rounded-[18px] lg:border">
        <CheckoutView
          chargeId={chargeId}
          method={method}
          onMethodChange={handleMethodChange}
        />
      </div>
    </main>
  )
}
