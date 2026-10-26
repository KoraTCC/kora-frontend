import { Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ProgressBar } from '#/components/ui/ProgressBar'
import { formatDate } from '#/lib/date'
import { formatNumber } from '#/lib/money'
import type { Merchant } from '#/features/merchant/types'

type ProfileAsideProps = {
  merchant: Merchant
}

export function ProfileAside({ merchant }: ProfileAsideProps) {
  const { plan } = merchant
  const usage = [
    {
      id: 'charges',
      label: 'Cobranças no mês',
      used: plan.chargesUsed,
      limit: plan.chargesLimit,
    },
    {
      id: 'api',
      label: 'Chamadas de API',
      used: plan.apiCallsUsed,
      limit: plan.apiCallsLimit,
    },
    {
      id: 'webhooks',
      label: 'Endpoints de webhook',
      used: plan.webhookEndpointsUsed,
      limit: plan.webhookEndpointsLimit,
    },
  ]

  return (
    <>
      <Card title="Status da conta">
        <DescriptionList
          items={[
            {
              label: 'Situação',
              value: merchant.status === 'active' ? 'Ativa' : 'Suspensa',
              tone: 'positive',
            },
            {
              label: 'Ambiente',
              value: merchant.environment === 'test' ? 'Testes' : 'Produção',
            },
            { label: 'ID do lojista', value: merchant.id },
            { label: 'Criada em', value: formatDate(merchant.createdAt) },
          ]}
        />
      </Card>
      <Callout>
        A Kora não custodia fundos. Os pagamentos vão direto para as carteiras
        cadastradas na aba “Carteiras e redes”.
      </Callout>
      <Card title="Uso do plano">
        <ul className="flex flex-col gap-3">
          {usage.map((item) => (
            <li key={item.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-ink">{item.label}</span>
                <span className="text-muted font-mono">
                  {formatNumber(item.used)} / {formatNumber(item.limit)}
                </span>
              </div>
              <ProgressBar value={item.used / item.limit} label={item.label} />
            </li>
          ))}
        </ul>
        <p className="text-dim text-[11px]">
          Plano {plan.name} · renova em {formatDate(plan.renewsAt)}
        </p>
      </Card>
      <Card title="Integração">
        <DescriptionList
          items={[
            { label: 'Chaves de API', value: '2 ativas', tone: 'positive' },
            { label: 'Webhooks', value: '1 falhando', tone: 'warning' },
            { label: 'Carteiras', value: '3 cadastradas' },
          ]}
        />
        <Link
          to="/dashboard"
          className={buttonClasses({
            variant: 'secondary',
            isBlock: true,
            size: 'sm',
          })}
        >
          Ver configuração inicial
        </Link>
      </Card>
    </>
  )
}
