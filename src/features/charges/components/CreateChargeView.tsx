import { Callout } from '#/components/ui/Callout'
import { useMerchant } from '#/features/merchant/hooks/useMerchant'
import { useCreateChargeForm } from '../hooks/useCreateChargeForm'
import { ChargeApiSnippetCard } from './ChargeApiSnippetCard'
import { ChargeNextStepsCard } from './ChargeNextStepsCard'
import { CheckoutPreviewCard } from './CheckoutPreviewCard'
import { CreateChargeForm } from './CreateChargeForm'

export function CreateChargeView() {
  const form = useCreateChargeForm()
  const { data: merchant } = useMerchant()
  const selectedWallet = form.walletOptions.find(
    (wallet) => wallet.id === form.values.walletId,
  )

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_372px]">
      <CreateChargeForm
        values={form.values}
        amountCents={form.amountCents}
        walletOptions={form.walletOptions}
        onFieldChange={form.setField}
        onNetworkChange={form.setNetwork}
        onSubmit={form.handleSubmit}
        fieldErrors={form.fieldErrors}
        formError={form.formError}
        isSubmitting={form.isSubmitting}
      />
      <div className="flex min-w-0 flex-col gap-4">
        <CheckoutPreviewCard
          merchantName={merchant?.checkout.displayName ?? 'Sua loja'}
          description={form.values.description}
          amountCents={form.amountCents}
          network={form.values.network}
          expiresInMinutes={Number(form.values.expiresInMinutes)}
          walletAddress={selectedWallet?.address}
        />
        <Callout tone="warning">
          Ambiente de testes. As cobranças criadas aqui usam Sepolia e Amoy e
          não movimentam valor real.
        </Callout>
        <ChargeNextStepsCard network={form.values.network} />
        <ChargeApiSnippetCard
          amountCents={form.amountCents}
          network={form.values.network}
        />
      </div>
    </div>
  )
}
