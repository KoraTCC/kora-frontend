import { Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { Checklist } from '#/components/ui/Checklist'
import { ErrorState } from '#/components/ui/ErrorState'
import { Skeleton } from '#/components/ui/Skeleton'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

/** Onboarding steps until the store can take a real payment. */
export function IntegrationCard() {
  const { data, isPending, isError, refetch } = useDashboardOverview('7d')

  if (isPending)
    return (
      <Card title="Integração">
        <Skeleton lines={4} />
      </Card>
    )
  if (isError)
    return (
      <Card title="Integração">
        <ErrorState onRetry={() => void refetch()} />
      </Card>
    )

  const doneCount = data.integration.filter((step) => step.isDone).length
  const progress = `${doneCount}/${data.integration.length}`
  const isComplete = doneCount === data.integration.length

  if (isComplete) return null

  return (
    <Card
      title="Integração"
      tone="accent"
      action={
        <span className="bg-lime text-on-lime rounded-full px-2 font-mono text-[10px] font-medium">
          {progress}
        </span>
      }
    >
      <Checklist items={data.integration} />
      <Link
        to="/webhooks"
        className={buttonClasses({ isBlock: true, size: 'sm' })}
      >
        Continuar configuração
      </Link>
    </Card>
  )
}
