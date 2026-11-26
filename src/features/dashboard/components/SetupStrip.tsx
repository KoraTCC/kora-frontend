import { Link } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { buttonClasses } from '#/components/ui/Button'
import { IconButton } from '#/components/ui/IconButton'
import { useStoredFlag } from '#/hooks/useStoredFlag'
import { cn } from '#/lib/cn'
import { useDashboardOverview } from '../hooks/useDashboardOverview'
import { getSetupProgress } from '../setupProgress'
import type { SetupStep } from '../setupProgress'

const HIDDEN_STORAGE_KEY = 'kora.dashboard.setupHidden'

type StepRoute =
  '/api-keys' | '/settings/wallets' | '/webhooks' | '/charges/new'

function routeForStep(stepId: string): StepRoute {
  switch (stepId) {
    case 'api-key':
      return '/api-keys'
    case 'wallet':
      return '/settings/wallets'
    case 'test':
      return '/charges/new'
    default:
      return '/webhooks'
  }
}

/**
 * Onboarding as a slim strip above the dashboard: progress, the steps as
 * chips and a shortcut to the next one. Gone once done or dismissed.
 */
export function SetupStrip() {
  const { data } = useDashboardOverview('7d')
  const [isHidden, hide] = useStoredFlag(HIDDEN_STORAGE_KEY)

  // Loading or failing here is not worth a placeholder: the strip is optional.
  if (!data || isHidden) return null

  const progress = getSetupProgress(data.integration)
  if (progress.isComplete || !progress.nextStep) return null

  return (
    // Sized by its own width, not the viewport: the sidebar takes a varying
    // share of the screen, so `lg:` alone squeezed the text into a column.
    <section
      aria-label="Configuração da conta"
      className="@container bg-surface border-line rounded-[14px] border p-4 sm:px-5"
    >
      <div className="grid grid-cols-1 items-center gap-x-6 gap-y-3.5 @xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 items-center gap-3.5">
          <ProgressRing done={progress.doneCount} total={progress.total} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-ink text-sm font-bold">
              Falta pouco para receber pagamentos reais
            </p>
            <p className="text-muted text-[13px]">
              Próximo passo: {progress.nextStep.label.toLowerCase()}.
            </p>
          </div>
        </div>

        <ol className="order-2 flex flex-wrap gap-1.5 @xl:order-3 @xl:col-span-2">
          {data.integration.map((step) => (
            <StepChip key={step.id} step={step} />
          ))}
        </ol>

        <div className="order-3 flex items-center gap-1.5 @xl:order-2">
          <Link
            to={routeForStep(progress.nextStep.id)}
            className={cn(
              buttonClasses({ size: 'sm', variant: 'secondary' }),
              'flex-1 whitespace-nowrap @xl:flex-none',
            )}
          >
            Continuar configuração
          </Link>
          <IconButton
            label="Ocultar configuração"
            icon={<X size={16} aria-hidden />}
            onClick={hide}
          />
        </div>
      </div>
    </section>
  )
}

function StepChip({ step }: { step: SetupStep }) {
  if (step.isDone)
    return (
      <li className="bg-lime-bg text-lime-deep flex h-[30px] items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold">
        <Check size={13} strokeWidth={3} aria-hidden />
        <span className="sr-only">Concluído: </span>
        {step.label}
      </li>
    )

  return (
    <li className="border-line-strong text-ink-soft flex h-[30px] items-center rounded-full border border-dashed px-2.5 text-xs font-semibold">
      <span className="sr-only">Pendente: </span>
      {step.label}
    </li>
  )
}

const RING_RADIUS = 16
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

function ProgressRing({ done, total }: { done: number; total: number }) {
  const filled = total === 0 ? 0 : (done / total) * RING_LENGTH
  const label = `${done} de ${total} etapas concluídas`

  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label={label}
      className="size-10 flex-none"
    >
      <circle
        cx="20"
        cy="20"
        r={RING_RADIUS}
        fill="none"
        strokeWidth="4"
        className="stroke-surface-2"
      />
      <circle
        cx="20"
        cy="20"
        r={RING_RADIUS}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${RING_LENGTH}`}
        transform="rotate(-90 20 20)"
        className="stroke-lime"
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        className="fill-ink-soft font-mono text-[11px] font-semibold"
      >
        {done}/{total}
      </text>
    </svg>
  )
}
