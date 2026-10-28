import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { INPUT_ALLOW, Input } from '#/components/ui/Input'
import { PillGroup } from '#/components/ui/PillGroup'
import { Select } from '#/components/ui/Select'
import { formatBRL, formatCrypto } from '#/lib/money'
import {
  NETWORKS,
  NETWORK_META,
  networkSchema,
  shortenAddress,
} from '#/features/networks/networks'
import type { Network } from '#/features/networks/networks'
import type { Wallet } from '#/features/wallets/types'
import { FormError } from '#/components/ui/FormError'
import { MOCK_RATES_CENTS, estimateCryptoAmount } from '../quote'
import { TOLERANCE_OPTIONS } from '../chargeOptions'
import { ChargeOrderFields } from './ChargeOrderFields'
import type {
  CreateChargeField,
  CreateChargeFieldErrors,
  CreateChargeFormValues,
} from '../types'

type CreateChargeFormProps = {
  values: CreateChargeFormValues
  amountCents: number
  walletOptions: ReadonlyArray<Wallet>
  onFieldChange: <TField extends CreateChargeField>(
    field: TField,
    value: CreateChargeFormValues[TField],
  ) => void
  onNetworkChange: (network: Network) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  fieldErrors: CreateChargeFieldErrors
  formError?: string
  isSubmitting: boolean
}

const NETWORK_OPTIONS = NETWORKS.map((network) => ({
  value: network,
  label: `${NETWORK_META[network].label} · ${NETWORK_META[network].asset}`,
}))
const CURRENCY_OPTIONS = [{ value: 'BRL', label: 'BRL · Real' }]

export function CreateChargeForm({
  values,
  amountCents,
  walletOptions,
  onFieldChange,
  onNetworkChange,
  onSubmit,
  fieldErrors,
  formError,
  isSubmitting,
}: CreateChargeFormProps) {
  const network = NETWORK_META[values.network]
  const quoteHint = `≈ ${formatCrypto(estimateCryptoAmount(amountCents, values.network), network.asset)} na cotação atual (${formatBRL(MOCK_RATES_CENTS[values.network])} / ${network.asset}).`
  const walletSelectOptions = walletOptions.map((wallet) => ({
    value: wallet.id,
    label: shortenAddress(wallet.address, 8),
  }))
  const walletHint = walletOptions.length
    ? `Carteira padrão da loja para ${network.label}.`
    : `Nenhuma carteira cadastrada para ${network.label}.`
  const submitLabel = isSubmitting ? 'Criando…' : 'Criar e abrir checkout'

  function handleNetworkChange(value: string) {
    const parsed = networkSchema.safeParse(value)
    if (parsed.success) onNetworkChange(parsed.data)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Card title="Valor">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <Input
            label="Valor a cobrar"
            name="amount"
            allow={INPUT_ALLOW.money}
            maxLength={13}
            inputMode="decimal"
            placeholder="249,00"
            value={values.amount}
            onChange={(event) => onFieldChange('amount', event.target.value)}
            error={fieldErrors.amount}
            autoFocus
          />
          <Select label="Moeda" options={CURRENCY_OPTIONS} defaultValue="BRL" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Receber em"
            options={NETWORK_OPTIONS}
            value={values.network}
            onChange={(event) => handleNetworkChange(event.target.value)}
            hint={quoteHint}
          />
          <Select
            label="Carteira de recebimento"
            options={walletSelectOptions}
            value={values.walletId}
            onChange={(event) => onFieldChange('walletId', event.target.value)}
            hint={walletHint}
            error={fieldErrors.walletId}
          />
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-muted mb-2 text-xs font-semibold">
            Tolerância de valor
          </legend>
          <PillGroup
            label="Tolerância de valor"
            options={TOLERANCE_OPTIONS}
            value={values.tolerance}
            onChange={(value) => onFieldChange('tolerance', value)}
          />
          <p className="text-dim text-[11px]">
            Pagamentos fora da faixa entram como parciais e ficam para revisão.
          </p>
        </fieldset>
      </Card>

      <ChargeOrderFields
        values={values}
        onFieldChange={onFieldChange}
        fieldErrors={fieldErrors}
      />

      <FormError message={formError} />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          name="intent"
          value="open"
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
        <Button
          type="submit"
          name="intent"
          value="copy"
          variant="secondary"
          disabled={isSubmitting}
        >
          Criar e copiar link
        </Button>
      </div>
    </form>
  )
}
