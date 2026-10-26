import { Card } from '#/components/ui/Card'
import { Input } from '#/components/ui/Input'
import { Switch } from '#/components/ui/Switch'
import type { FieldErrors } from '#/lib/formErrors'
import type { BillingSettings } from '../types'

type CustomerCommunicationCardProps = {
  settings: BillingSettings
  errors: FieldErrors<keyof BillingSettings>
}

export function CustomerCommunicationCard({
  settings,
  errors,
}: CustomerCommunicationCardProps) {
  return (
    <Card title="Comunicação com o cliente">
      <Switch
        name="sendReceipt"
        label="Enviar recibo por e-mail"
        description="Disparado quando a cobrança é confirmada."
        defaultChecked={settings.sendReceipt}
      />
      <Switch
        name="notifyDetected"
        label="Avisar quando o pagamento for detectado"
        description="Mostra “confirmando na rede” no checkout."
        defaultChecked={settings.notifyDetected}
      />
      <Switch
        name="remindBeforeExpiry"
        label="Lembrete antes de expirar"
        description="Enviado 5 minutos antes do fim da janela."
        defaultChecked={settings.remindBeforeExpiry}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Remetente dos e-mails"
          name="senderEmail"
          defaultValue={settings.senderEmail}
          error={errors.senderEmail}
        />
        <Input
          label="Voltar para"
          name="returnUrl"
          type="url"
          defaultValue={settings.returnUrl}
          error={errors.returnUrl}
        />
      </div>
    </Card>
  )
}
