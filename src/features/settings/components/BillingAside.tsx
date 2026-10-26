import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { DescriptionList } from '#/components/ui/DescriptionList'
import { ErrorState } from '#/components/ui/ErrorState'
import { ProgressBar } from '#/components/ui/ProgressBar'
import type { ProgressTone } from '#/components/ui/ProgressBar'
import { Skeleton } from '#/components/ui/Skeleton'
import { formatPercent } from '#/lib/money'
import {
  useBillingInsights,
  useBillingSettings,
} from '../hooks/useSettingsQueries'
import { EXPIRATION_LABELS as WINDOW_LABELS } from '#/features/charges/chargeOptions'

/** Higher expiry share, warmer colour. */
function expiryTone(share: number): ProgressTone {
  if (share >= 0.2) return 'danger'
  if (share >= 0.1) return 'warning'
  return 'lime'
}

export function BillingAside() {
  const insights = useBillingInsights()
  const settings = useBillingSettings()

  if (insights.isPending)
    return (
      <Card>
        <Skeleton lines={6} />
      </Card>
    )
  if (insights.isError)
    return (
      <Card>
        <ErrorState onRetry={() => void insights.refetch()} />
      </Card>
    )

  const { data } = insights
  const currentWindow = settings.data?.defaultWindowMinutes
  const windows = data.expirationByWindow.map((row) => ({
    ...row,
    label:
      row.window === currentWindow
        ? `${WINDOW_LABELS[row.window]} · atual`
        : WINDOW_LABELS[row.window],
    tone: expiryTone(row.share),
  }))

  return (
    <>
      <Card title={`Efeito nas últimas ${data.total} cobranças`}>
        <DescriptionList
          items={[
            {
              label: 'Dentro da tolerância',
              value: data.withinTolerance,
              tone: 'positive',
            },
            { label: 'Viraram parciais', value: data.partial, tone: 'warning' },
            { label: 'Expiradas na janela', value: data.expired },
          ]}
        />
        <p className="text-dim text-[11px]">{data.suggestion}</p>
      </Card>
      <Card title="Expiração por janela">
        <ul className="flex flex-col gap-3">
          {windows.map((row) => (
            <li key={row.window} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-ink">{row.label}</span>
                <span className="text-muted font-mono">
                  {formatPercent(row.share, 0)} expiram
                </span>
              </div>
              <ProgressBar
                value={row.share * 3}
                tone={row.tone}
                label={`Expiração com janela de ${row.label}`}
              />
            </li>
          ))}
        </ul>
        <p className="text-dim text-[11px]">
          Janelas maiores reduzem expirações, mas expõem mais a variação de
          cotação.
        </p>
      </Card>
      <Callout>
        Mudanças aqui valem só para cobranças novas. As que já estão abertas
        mantêm as regras do momento em que foram criadas.
      </Callout>
    </>
  )
}
