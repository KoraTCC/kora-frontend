import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { FormError } from '#/components/ui/FormError'
import { Input } from '#/components/ui/Input'
import { Modal } from '#/components/ui/Modal'
import { PasswordInput } from '#/components/ui/PasswordInput'
import { useDisableTwoFactor } from '#/features/auth/hooks/useTwoFactorSettings'
import { disableTwoFactorFormSchema } from '#/features/auth/schemas'
import {
  getFormError,
  toFieldErrors,
  zodIssuesToApiIssues,
} from '#/lib/formErrors'
import type { FieldErrors } from '#/lib/formErrors'
import { ApiError } from '#/lib/http'

type DisableTwoFactorModalProps = {
  open: boolean
  onClose: () => void
}

const FIELDS = ['password', 'code'] as const

/** Password + code: an unattended open session can't turn 2FA off. */
export function DisableTwoFactorModal({
  open,
  onClose,
}: DisableTwoFactorModalProps) {
  const formId = useId()
  const disable = useDisableTwoFactor()
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<(typeof FIELDS)[number]>
  >({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const parsed = disableTwoFactorFormSchema.safeParse({
      password: form.get('password'),
      code: form.get('code'),
    })
    if (!parsed.success) {
      setFieldErrors(
        toFieldErrors(zodIssuesToApiIssues(parsed.error.issues), FIELDS),
      )
      return
    }
    setFieldErrors({})
    disable.mutate(parsed.data, {
      onSuccess: onClose,
      onError: (error) => {
        if (error instanceof ApiError)
          setFieldErrors(toFieldErrors(error.issues, FIELDS))
      },
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Desativar verificação em duas etapas"
      description="O login volta a pedir só a senha. Confirme que é você."
      footer={
        <Button
          type="submit"
          form={formId}
          variant="danger"
          isBlock
          disabled={disable.isPending}
        >
          {disable.isPending ? 'Desativando…' : 'Desativar'}
        </Button>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <PasswordInput
          label="Senha"
          name="password"
          autoComplete="current-password"
          error={fieldErrors.password}
          autoFocus
        />
        <Input
          label="Código do aplicativo ou de recuperação"
          name="code"
          placeholder="123456 ou xxxx-xxxx"
          autoComplete="one-time-code"
          allow={/[a-zA-Z0-9-]/}
          maxLength={9}
          error={fieldErrors.code}
        />
        <FormError message={getFormError(disable.error, FIELDS)} />
      </form>
    </Modal>
  )
}
