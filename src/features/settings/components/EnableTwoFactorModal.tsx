import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/Button'
import { CopyField } from '#/components/ui/CopyField'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Modal } from '#/components/ui/Modal'
import { OtpInput } from '#/components/ui/OtpInput'
import { Skeleton } from '#/components/ui/Skeleton'
import {
  useEnableTwoFactor,
  useStartTwoFactorSetup,
} from '#/features/auth/hooks/useTwoFactorSettings'
import {
  TWO_FACTOR_CODE_LENGTH,
  twoFactorSchema,
} from '#/features/auth/schemas'
import { ApiError } from '#/lib/http'
import { RecoveryCodesPanel } from './RecoveryCodesPanel'

type EnableTwoFactorModalProps = {
  open: boolean
  onClose: () => void
}

/**
 * Mounted only while open. Step 1: scan the QR code and confirm one code.
 * Step 2: the recovery codes, shown once.
 */
export function EnableTwoFactorModal({
  open,
  onClose,
}: EnableTwoFactorModalProps) {
  const formId = useId()
  const setup = useStartTwoFactorSetup()
  const enable = useEnableTwoFactor()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()

  // A fresh secret every time the dialog opens; nothing is on until confirmed.
  const { mutate: startSetup } = setup
  useEffect(() => {
    startSetup()
  }, [startSetup])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = twoFactorSchema.safeParse({ code })
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message)
      return
    }
    enable.mutate(parsed.data, {
      onError: (error) => {
        if (!(error instanceof ApiError)) return
        setCodeError(
          error.issues.find((issue) => issue.path === 'code')?.message,
        )
        setCode('')
      },
    })
  }

  if (enable.data) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Verificação em duas etapas ativada"
        description="A partir de agora, o login pede o código do aplicativo além da senha."
        footer={
          <Button isBlock onClick={onClose}>
            Guardei os códigos
          </Button>
        }
      >
        <RecoveryCodesPanel codes={enable.data.recoveryCodes} />
      </Modal>
    )
  }

  const submitLabel = enable.isPending ? 'Confirmando…' : 'Ativar'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ativar verificação em duas etapas"
      description="Escaneie o QR code com um aplicativo autenticador (Google Authenticator, Authy, 1Password…) e digite o código que ele mostrar."
      footer={
        <Button
          type="submit"
          form={formId}
          isBlock
          disabled={!setup.data || enable.isPending}
        >
          {submitLabel}
        </Button>
      }
    >
      {setup.isPending ? (
        <Skeleton lines={6} label="Gerando o QR code…" />
      ) : null}
      {setup.isError ? <ErrorState onRetry={() => startSetup()} /> : null}
      {setup.data ? (
        <form
          id={formId}
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="mx-auto rounded-[14px] bg-white p-3">
            <QRCodeSVG
              value={setup.data.otpauthUri}
              size={184}
              marginSize={0}
              title="QR code para o aplicativo autenticador"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-xs">
              Não consegue escanear? Digite esta chave no app:
            </p>
            <CopyField
              value={setup.data.secret}
              label="Chave do autenticador"
            />
          </div>
          <OtpInput
            label="Código do aplicativo"
            length={TWO_FACTOR_CODE_LENGTH}
            value={code}
            onChange={(next) => {
              setCode(next)
              setCodeError(undefined)
            }}
            error={codeError}
          />
          <FormError
            message={
              enable.error &&
              !(enable.error instanceof ApiError && enable.error.issues.length)
                ? enable.error.message
                : undefined
            }
          />
        </form>
      ) : null}
    </Modal>
  )
}
