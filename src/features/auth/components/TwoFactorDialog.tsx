import { useId } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { Modal } from '#/components/ui/Modal'
import { OtpInput } from '#/components/ui/OtpInput'
import { TWO_FACTOR_CODE_LENGTH } from '../schemas'
import { FormError } from '#/components/ui/FormError'
import { ResendHint } from './ResendHint'

type TwoFactorDialogProps = {
  open: boolean
  onClose: () => void
  code: string
  onCodeChange: (code: string) => void
  codeError?: string
  formError?: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
  resendSecondsLeft: number
  onResend: () => void
  isResending?: boolean
}

export function TwoFactorDialog({
  open,
  onClose,
  code,
  onCodeChange,
  codeError,
  formError,
  onSubmit,
  isSubmitting,
  resendSecondsLeft,
  onResend,
  isResending,
}: TwoFactorDialogProps) {
  const formId = useId()
  const submitLabel = isSubmitting ? 'Verificando…' : 'Verificar e entrar'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Verificação em duas etapas"
      description={`Digite o código de ${TWO_FACTOR_CODE_LENGTH} dígitos gerado pelo seu aplicativo autenticador.`}
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
        <OtpInput
          label="Código de verificação"
          length={TWO_FACTOR_CODE_LENGTH}
          value={code}
          onChange={onCodeChange}
          error={codeError}
          autoFocus
        />

        <ResendHint
          secondsLeft={resendSecondsLeft}
          action={
            <button
              type="button"
              onClick={onResend}
              disabled={isResending}
              className="text-lime mx-auto min-h-11 text-xs font-semibold hover:underline disabled:opacity-45 lg:min-h-0"
            >
              Reenviar código
            </button>
          }
        />

        <FormError message={formError} />
      </form>
    </Modal>
  )
}
