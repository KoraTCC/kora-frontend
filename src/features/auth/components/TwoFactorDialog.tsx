import { useId } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import { OtpInput } from '#/components/ui/OtpInput'
import type { TwoFactorMode } from '../hooks/useTwoFactorForm'
import { TWO_FACTOR_CODE_LENGTH } from '../schemas'

type TwoFactorDialogProps = {
  open: boolean
  onClose: () => void
  mode: TwoFactorMode
  onToggleMode: () => void
  code: string
  onCodeChange: (code: string) => void
  codeError?: string
  formError?: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
}

const DESCRIPTIONS: Record<TwoFactorMode, string> = {
  app: `Digite o código de ${TWO_FACTOR_CODE_LENGTH} dígitos gerado pelo seu aplicativo autenticador.`,
  recovery:
    'Digite um dos códigos de recuperação que você guardou ao ativar a verificação. Cada código vale uma vez.',
}

export function TwoFactorDialog({
  open,
  onClose,
  mode,
  onToggleMode,
  code,
  onCodeChange,
  codeError,
  formError,
  onSubmit,
  isSubmitting,
}: TwoFactorDialogProps) {
  const formId = useId()
  const submitLabel = isSubmitting ? 'Verificando…' : 'Verificar e entrar'
  const toggleLabel =
    mode === 'app'
      ? 'Perdeu o celular? Usar um código de recuperação'
      : 'Usar o código do aplicativo'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Verificação em duas etapas"
      description={DESCRIPTIONS[mode]}
      align="center"
      footer={
        <Button type="submit" form={formId} isBlock disabled={isSubmitting}>
          {submitLabel}
        </Button>
      }
    >
      <form
        id={formId}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
        noValidate
      >
        {mode === 'app' ? (
          <OtpInput
            label="Código de verificação"
            length={TWO_FACTOR_CODE_LENGTH}
            value={code}
            onChange={onCodeChange}
            error={codeError}
            autoFocus
          />
        ) : (
          <Input
            label="Código de recuperação"
            name="recoveryCode"
            placeholder="xxxx-xxxx"
            autoComplete="one-time-code"
            autoCapitalize="none"
            spellCheck={false}
            allow={/[a-zA-Z0-9-]/}
            maxLength={9}
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            error={codeError}
            autoFocus
          />
        )}

        <button
          type="button"
          onClick={onToggleMode}
          className="text-lime mx-auto min-h-11 text-xs font-semibold hover:underline lg:min-h-0"
        >
          {toggleLabel}
        </button>

        <FormError message={formError} />
      </form>
    </Modal>
  )
}
