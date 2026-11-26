import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import { useRegenerateRecoveryCodes } from '#/features/auth/hooks/useTwoFactorSettings'
import { twoFactorCredentialSchema } from '#/features/auth/schemas'
import { getFormError } from '#/lib/formErrors'
import { ApiError } from '#/lib/http'
import { RecoveryCodesPanel } from './RecoveryCodesPanel'

type RegenerateRecoveryCodesModalProps = {
  open: boolean
  onClose: () => void
}

/** New codes invalidate the old ones; confirmed with a current code. */
export function RegenerateRecoveryCodesModal({
  open,
  onClose,
}: RegenerateRecoveryCodesModalProps) {
  const formId = useId()
  const regenerate = useRegenerateRecoveryCodes()
  const [codeError, setCodeError] = useState<string>()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = twoFactorCredentialSchema.safeParse(
      new FormData(event.currentTarget).get('code'),
    )
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message)
      return
    }
    setCodeError(undefined)
    regenerate.mutate(
      { code: parsed.data },
      {
        onError: (error) => {
          if (error instanceof ApiError)
            setCodeError(
              error.issues.find((issue) => issue.path === 'code')?.message,
            )
        },
      },
    )
  }

  if (regenerate.data) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Novos códigos de recuperação"
        description="Os códigos anteriores deixaram de valer."
        footer={
          <Button isBlock onClick={onClose}>
            Guardei os códigos
          </Button>
        }
      >
        <RecoveryCodesPanel codes={regenerate.data.recoveryCodes} />
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gerar novos códigos de recuperação"
      description="Os códigos atuais deixam de valer. Confirme com o código do aplicativo."
      footer={
        <Button
          type="submit"
          form={formId}
          isBlock
          disabled={regenerate.isPending}
        >
          {regenerate.isPending ? 'Gerando…' : 'Gerar novos códigos'}
        </Button>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          label="Código do aplicativo ou de recuperação"
          name="code"
          placeholder="123456 ou xxxx-xxxx"
          autoComplete="one-time-code"
          allow={/[a-zA-Z0-9-]/}
          maxLength={9}
          error={codeError}
          autoFocus
        />
        <FormError message={getFormError(regenerate.error, ['code'])} />
      </form>
    </Modal>
  )
}
