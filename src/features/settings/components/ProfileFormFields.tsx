import { Card } from '#/components/ui/Card'
import { Input } from '#/components/ui/Input'
import { Select } from '#/components/ui/Select'
import { Switch } from '#/components/ui/Switch'
import type {
  Merchant,
  MerchantProfileFieldErrors,
} from '#/features/merchant/types'

const STATE_OPTIONS = ['SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'BA', 'DF'].map(
  (uf) => ({ value: uf, label: uf }),
)
const COUNTRY_OPTIONS = [{ value: 'BR', label: 'Brasil' }]

type ProfileFormFieldsProps = {
  merchant: Merchant
  errors: MerchantProfileFieldErrors
}

export function ProfileFormFields({
  merchant,
  errors,
}: ProfileFormFieldsProps) {
  return (
    <>
      <Card title="Dados da loja">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome da loja"
            name="name"
            defaultValue={merchant.name}
            error={errors.name}
          />
          <Input
            label="Razão social"
            name="legalName"
            defaultValue={merchant.legalName}
            error={errors.legalName}
          />
          <Input
            label="CNPJ"
            name="document"
            inputMode="numeric"
            defaultValue={merchant.document}
            error={errors.document}
          />
          <Input
            label="Telefone"
            name="phone"
            type="tel"
            defaultValue={merchant.phone}
            error={errors.phone}
          />
          <Input
            label="E-mail de contato"
            name="email"
            type="email"
            defaultValue={merchant.email}
            error={errors.email}
          />
          <Input
            label="Site"
            name="website"
            type="url"
            defaultValue={merchant.website}
            error={errors.website}
          />
        </div>
      </Card>
      <Card title="Aparência do checkout">
        <Input
          label="Nome exibido ao cliente"
          name="displayName"
          defaultValue={merchant.checkout.displayName}
          error={errors.displayName}
        />
        <Switch
          name="showLogo"
          label="Mostrar logo no checkout"
          description="Aparece no topo da página de pagamento."
          defaultChecked={merchant.checkout.showLogo}
        />
        <Switch
          name="showBackButton"
          label="Botão “voltar à loja”"
          description="Leva o cliente de volta após o pagamento."
          defaultChecked={merchant.checkout.showBackButton}
        />
      </Card>
      <Card title="Endereço fiscal">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_minmax(0,1fr)_140px]">
          <Input
            label="CEP"
            name="postalCode"
            inputMode="numeric"
            defaultValue={merchant.address.postalCode}
            error={errors.postalCode}
          />
          <Input
            label="Logradouro"
            name="street"
            defaultValue={merchant.address.street}
            error={errors.street}
          />
          <Input
            label="Complemento"
            name="complement"
            placeholder="Sala 402"
            defaultValue={merchant.address.complement}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_140px_140px]">
          <Input
            label="Cidade"
            name="city"
            defaultValue={merchant.address.city}
            error={errors.city}
          />
          <Select
            label="Estado"
            name="state"
            options={STATE_OPTIONS}
            defaultValue={merchant.address.state}
            error={errors.state}
          />
          <Select
            label="País"
            name="country"
            options={COUNTRY_OPTIONS}
            defaultValue={merchant.address.country}
          />
        </div>
      </Card>
    </>
  )
}
