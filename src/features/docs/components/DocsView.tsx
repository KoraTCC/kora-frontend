import { Callout } from '#/components/ui/Callout'
import { Card } from '#/components/ui/Card'
import { StatusBadge } from '#/components/ui/StatusBadge'
import { CHARGE_STATUS_META } from '#/features/charges/chargeStatus'
import { CHARGE_STATUSES } from '#/features/charges/schemas'
import { DOC_SECTIONS } from '../content'
import { DocSectionCard } from './DocSectionCard'

export function DocsView() {
  const sections = DOC_SECTIONS.map((section, index) => ({
    section,
    step: index + 1,
  }))

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_266px]">
      <div className="flex min-w-0 flex-col gap-4">
        {sections.map(({ section, step }) => (
          <DocSectionCard key={section.id} section={section} step={step} />
        ))}
      </div>

      <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
        <Card title="Nesta página">
          <nav aria-label="Seções da documentação">
            <ol className="flex flex-col gap-1">
              {sections.map(({ section, step }) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-muted hover:text-ink flex min-h-11 items-center text-xs lg:min-h-7"
                  >
                    {step} · {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Card>
        <Card title="Estados da cobrança">
          <ul className="flex flex-col gap-2">
            {CHARGE_STATUSES.map((status) => (
              <li key={status}>
                <StatusBadge tone={CHARGE_STATUS_META[status].tone}>
                  {CHARGE_STATUS_META[status].label}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </Card>
        <Callout tone="warning">
          Ambiente de testes: Sepolia e Amoy. Nenhum valor real é movimentado.
        </Callout>
      </aside>
    </div>
  )
}
