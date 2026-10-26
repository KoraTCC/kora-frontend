import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { Checklist } from '#/components/ui/Checklist'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Modal } from '#/components/ui/Modal'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatDayTime } from '#/lib/date'
import { useAccessLog, useCloseAccount } from '../hooks/useSettingsQueries'

const RECOMMENDATIONS = [
  { id: '2fa', label: '2FA ativa na sua conta', isDone: true },
  {
    id: 'rotation',
    label: 'Chave secreta rotacionada nos últimos 90 dias',
    isDone: true,
  },
  { id: 'team-2fa', label: 'Exigir 2FA de toda a equipe', isDone: false },
  {
    id: 'unused-key',
    label: 'Revogar a chave sem uso desde 03/07',
    isDone: false,
  },
]

export function SecurityAside() {
  const accessLog = useAccessLog()
  const closeAccount = useCloseAccount()
  const [isCloseOpen, setIsCloseOpen] = useState(false)
  const closeError = closeAccount.isError
    ? 'Não foi possível encerrar a conta.'
    : undefined

  return (
    <>
      <Callout tone="danger">
        Encerrar a conta remove as chaves de API e desativa o checkout
        imediatamente. As cobranças já liquidadas continuam registradas.
      </Callout>
      <Card title="Zona de risco">
        <p className="text-dim -mt-1 text-[11px]">
          Ações irreversíveis para esta loja.
        </p>
        <Button variant="danger" isBlock onClick={() => setIsCloseOpen(true)}>
          Encerrar conta
        </Button>
      </Card>
      <Card title="Acessos recentes">
        <AccessLogBody accessLog={accessLog} />
      </Card>
      <Card title="Recomendações">
        <Checklist items={RECOMMENDATIONS} />
      </Card>

      <Modal
        open={isCloseOpen}
        onClose={() => setIsCloseOpen(false)}
        title="Encerrar a conta?"
        description="O checkout sai do ar e as chaves de API deixam de funcionar. Não dá para desfazer."
        size="sm"
        footer={
          <>
            <Button
              variant="danger"
              isBlock
              onClick={() => closeAccount.mutate()}
              disabled={closeAccount.isPending}
            >
              Encerrar definitivamente
            </Button>
            <Button
              variant="ghost"
              isBlock
              onClick={() => setIsCloseOpen(false)}
            >
              Manter a conta
            </Button>
          </>
        }
      >
        <FormError message={closeError} />
      </Modal>
    </>
  )
}

function AccessLogBody({
  accessLog,
}: {
  accessLog: ReturnType<typeof useAccessLog>
}) {
  if (accessLog.isPending) return <Skeleton lines={4} />
  if (accessLog.isError)
    return <ErrorState onRetry={() => void accessLog.refetch()} />

  return (
    <DescriptionList
      items={accessLog.data.map((entry) => ({
        label: formatDayTime(entry.at),
        value: `${entry.isSuccess ? 'Sucesso' : 'Falhou'} · ${entry.location}`,
        tone: entry.isSuccess ? 'positive' : 'danger',
      }))}
    />
  )
}
