import { Card } from '#/components/ui/Card'
import { INPUT_ALLOW, Input } from '#/components/ui/Input'
import { PillGroup } from '#/components/ui/PillGroup'
import { Switch } from '#/components/ui/Switch'
import { EXPIRATION_OPTIONS } from '../chargeOptions'
import type {
  CreateChargeField,
  CreateChargeFieldErrors,
  CreateChargeFormValues,
} from '../types'

type ChargeOrderFieldsProps = {
  values: CreateChargeFormValues
  onFieldChange: <TField extends CreateChargeField>(
    field: TField,
    value: CreateChargeFormValues[TField],
  ) => void
  fieldErrors: CreateChargeFieldErrors
}

/** "Pedido" card of the create-charge form. */
export function ChargeOrderFields({
  values,
  onFieldChange,
  fieldErrors,
}: ChargeOrderFieldsProps) {
  return (
    <Card title="Pedido">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Referência do pedido"
          name="reference"
          allow={INPUT_ALLOW.reference}
          maxLength={80}
          placeholder="#10483"
          value={values.reference}
          onChange={(event) => onFieldChange('reference', event.target.value)}
          error={fieldErrors.reference}
        />
        <Input
          label="E-mail do cliente (opcional)"
          name="customerEmail"
          maxLength={254}
          type="email"
          placeholder="cliente@exemplo.com"
          value={values.customerEmail}
          onChange={(event) =>
            onFieldChange('customerEmail', event.target.value)
          }
          error={fieldErrors.customerEmail}
        />
      </div>
      <Input
        label="Descrição (aparece no checkout)"
        name="description"
        maxLength={120}
        placeholder="Camiseta Kora · tamanho M"
        value={values.description}
        onChange={(event) => onFieldChange('description', event.target.value)}
        error={fieldErrors.description}
      />
      <fieldset className="flex flex-col gap-2">
        <legend className="text-muted mb-2 text-xs font-semibold">
          Expira em
        </legend>
        <PillGroup
          label="Expira em"
          options={EXPIRATION_OPTIONS}
          value={values.expiresInMinutes}
          onChange={(value) => onFieldChange('expiresInMinutes', value)}
        />
      </fieldset>
      <Switch
        label="Enviar link por e-mail"
        description="Dispara assim que a cobrança for criada."
        checked={values.sendEmail}
        onChange={(event) => onFieldChange('sendEmail', event.target.checked)}
      />
    </Card>
  )
}
