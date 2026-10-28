import { Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Select } from '#/components/ui/Select'
import { Switch } from '#/components/ui/Switch'
import type { FieldErrors } from '#/lib/formErrors'
import type { FormEvent } from 'react'
import { SETTINGS_FORM_ID } from '../schemas'
import type { SecuritySettings } from '../types'
import { SessionsCard } from './SessionsCard'

type SecurityFormProps = {
  settings: SecuritySettings
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onReset: () => void
  fieldErrors: FieldErrors<keyof SecuritySettings>
  formError?: string
}

const TIMEOUT_OPTIONS = [
  { value: '1h', label: '1 hora de inatividade' },
  { value: '12h', label: '12 horas de inatividade' },
  { value: '7d', label: '7 dias de inatividade' },
]

const LOCKOUT_OPTIONS = [
  { value: '3', label: '3 tentativas malsucedidas' },
  { value: '5', label: '5 tentativas malsucedidas' },
  { value: '10', label: '10 tentativas malsucedidas' },
]

export function SecurityForm({
  settings,
  onSubmit,
  onReset,
  fieldErrors,
  formError,
}: SecurityFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <form
        id={SETTINGS_FORM_ID}
        onSubmit={onSubmit}
        onReset={onReset}
        noValidate
        className="flex flex-col gap-4"
      >
        <Card title="Acesso">
          <Switch
            name="twoFactorEnabled"
            label="Verificação em duas etapas"
            description="Aplicativo autenticador · configurado em 12/08."
            defaultChecked={settings.twoFactorEnabled}
          />
          <Switch
            name="requireTeamTwoFactor"
            label="Exigir 2FA de toda a equipe"
            description="Membros sem 2FA perdem o acesso até configurar."
            defaultChecked={settings.requireTeamTwoFactor}
          />
          <div className="flex flex-col items-start gap-2">
            <p className="text-muted text-xs font-semibold">Trocar senha</p>
            <Link
              to="/forgot-password"
              className={buttonClasses({ variant: 'secondary', size: 'sm' })}
            >
              Redefinir senha
            </Link>
          </div>
        </Card>
      </form>

      <SessionsCard />

      <Card title="Restrições de acesso">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            form={SETTINGS_FORM_ID}
            label="Encerrar sessão após"
            name="sessionTimeout"
            options={TIMEOUT_OPTIONS}
            defaultValue={settings.sessionTimeout}
          />
          <Select
            form={SETTINGS_FORM_ID}
            label="Bloquear conta após"
            name="lockoutAttempts"
            options={LOCKOUT_OPTIONS}
            defaultValue={settings.lockoutAttempts}
          />
        </div>
        <Input
          form={SETTINGS_FORM_ID}
          label="IPs permitidos para a API"
          name="allowedIps"
          allow={/[\d.,/\s]/}
          maxLength={500}
          placeholder="201.17.44.8, 189.44.2.0/24 — vazio libera todos"
          defaultValue={settings.allowedIps}
          hint="Só vale para as chaves secretas. O checkout público não é afetado."
          error={fieldErrors.allowedIps}
        />
        <Switch
          form={SETTINGS_FORM_ID}
          name="notifyNewLocation"
          label="Avisar sobre acesso de local novo"
          description="E-mail para o dono quando houver login de outra região."
          defaultChecked={settings.notifyNewLocation}
        />
        <FormError message={formError} />
      </Card>
    </div>
  )
}
