import { Card } from '#/components/ui/Card'
import { PillGroup } from '#/components/ui/PillGroup'
import { Select } from '#/components/ui/Select'
import { Switch } from '#/components/ui/Switch'
import {
  EXPIRATION_OPTIONS as WINDOW_OPTIONS,
  TOLERANCE_OPTIONS,
} from '#/features/charges/chargeOptions'
import { NETWORKS, NETWORK_META } from '#/features/networks/networks'
import type { BillingSettings } from '../types'

const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'BRL · Real brasileiro' },
  { value: 'USD', label: 'USD · Dólar' },
  { value: 'EUR', label: 'EUR · Euro' },
]
const NETWORK_OPTIONS = NETWORKS.map((network) => ({
  value: network,
  label: `${NETWORK_META[network].label} · ${NETWORK_META[network].asset}`,
}))

type PaymentRulesCardProps = {
  settings: BillingSettings
  tolerance: BillingSettings['defaultTolerance']
  onToleranceChange: (value: BillingSettings['defaultTolerance']) => void
  paymentWindow: BillingSettings['defaultWindowMinutes']
  onWindowChange: (value: BillingSettings['defaultWindowMinutes']) => void
}

/** Pill choices are controlled, so hidden inputs carry them into the form. */
export function PaymentRulesCard({
  settings,
  tolerance,
  onToleranceChange,
  paymentWindow,
  onWindowChange,
}: PaymentRulesCardProps) {
  return (
    <Card title="Regras de pagamento">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-muted mb-2 text-xs font-semibold">
            Tolerância de valor padrão
          </legend>
          <PillGroup
            label="Tolerância de valor padrão"
            options={TOLERANCE_OPTIONS}
            value={tolerance}
            onChange={onToleranceChange}
          />
          <input type="hidden" name="defaultTolerance" value={tolerance} />
          <p className="text-dim text-[11px]">
            Pagamentos abaixo da faixa viram PARCIAL e ficam para revisão
            manual.
          </p>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-muted mb-2 text-xs font-semibold">
            Janela de pagamento padrão
          </legend>
          <PillGroup
            label="Janela de pagamento padrão"
            options={WINDOW_OPTIONS}
            value={paymentWindow}
            onChange={onWindowChange}
          />
          <input
            type="hidden"
            name="defaultWindowMinutes"
            value={paymentWindow}
          />
          <p className="text-dim text-[11px]">
            Tempo que o cliente tem para pagar antes de a cotação cair.
          </p>
        </fieldset>
        <Select
          label="Moeda de referência"
          name="referenceCurrency"
          options={CURRENCY_OPTIONS}
          defaultValue={settings.referenceCurrency}
          hint="A cotação é travada quando a cobrança é criada."
        />
        <Select
          label="Rede padrão do checkout"
          name="defaultNetwork"
          options={NETWORK_OPTIONS}
          defaultValue={settings.defaultNetwork}
          hint="O cliente pode trocar entre as redes habilitadas."
        />
      </div>
      <Switch
        name="acceptOverpayment"
        label="Aceitar pagamento acima do valor"
        description="Excedente fica registrado como crédito na cobrança."
        defaultChecked={settings.acceptOverpayment}
      />
      <Switch
        name="autoExpire"
        label="Expirar automaticamente"
        description="Marca como EXPIRADO ao fim da janela, sem intervenção."
        defaultChecked={settings.autoExpire}
      />
    </Card>
  )
}
