import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { useTwoFactorStatus } from '#/features/auth/hooks/useTwoFactorSettings'
import { formatDate } from '#/lib/date'
import { DisableTwoFactorModal } from './DisableTwoFactorModal'
import { EnableTwoFactorModal } from './EnableTwoFactorModal'
import { RegenerateRecoveryCodesModal } from './RegenerateRecoveryCodesModal'

type OpenDialog = 'enable' | 'disable' | 'regenerate' | null

/** Fewer than this many recovery codes left: suggest generating new ones. */
const LOW_RECOVERY_CODES = 3

export function TwoFactorCard() {
  const { data: status, isPending, isError, refetch } = useTwoFactorStatus()
  const [dialog, setDialog] = useState<OpenDialog>(null)
  const close = () => setDialog(null)

  const badge = status ? (
    <StatusBadge tone={status.enabled ? 'confirmed' : 'expired'}>
      {status.enabled ? 'Ativa' : 'Desativada'}
    </StatusBadge>
  ) : null

  return (
    <Card title="Verificação em duas etapas" action={badge}>
      {isPending ? <Skeleton lines={3} /> : null}
      {isError ? <ErrorState onRetry={() => void refetch()} /> : null}

      {status && !status.enabled ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted text-[13px] leading-relaxed">
            Além da senha, o login passa a pedir um código de 6 dígitos do seu
            aplicativo autenticador. Mesmo que a senha vaze, ninguém entra sem o
            seu celular.
          </p>
          <Button size="sm" onClick={() => setDialog('enable')}>
            Ativar
          </Button>
        </div>
      ) : null}

      {status?.enabled ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted text-[13px] leading-relaxed">
            Aplicativo autenticador
            {status.enabledAt
              ? ` · ativada em ${formatDate(status.enabledAt)}`
              : ''}
            .
          </p>
          <p
            className={
              status.recoveryCodesLeft <= LOW_RECOVERY_CODES
                ? 'text-status-pending text-xs'
                : 'text-dim text-xs'
            }
          >
            {status.recoveryCodesLeft} códigos de recuperação restantes
            {status.recoveryCodesLeft <= LOW_RECOVERY_CODES
              ? ' — gere novos para não ficar sem acesso.'
              : '.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDialog('regenerate')}
            >
              Gerar novos códigos
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDialog('disable')}
            >
              Desativar
            </Button>
          </div>
        </div>
      ) : null}

      {/* Mounted only while open: each opening starts from a clean state. */}
      {dialog === 'enable' ? (
        <EnableTwoFactorModal open onClose={close} />
      ) : null}
      {dialog === 'disable' ? (
        <DisableTwoFactorModal open onClose={close} />
      ) : null}
      {dialog === 'regenerate' ? (
        <RegenerateRecoveryCodesModal open onClose={close} />
      ) : null}
    </Card>
  )
}
