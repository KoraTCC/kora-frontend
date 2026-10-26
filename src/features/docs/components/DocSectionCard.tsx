import { Card } from '#/components/ui/Card'
import { CodeBlock } from '#/components/ui/CodeBlock'
import { DescriptionList } from '#/components/ui/DescriptionList'
import type { DocSection } from '../content'

type DocSectionCardProps = {
  section: DocSection
  step: number
}

export function DocSectionCard({ section, step }: DocSectionCardProps) {
  return (
    <article id={section.id} className="scroll-mt-24">
      <Card
        title={
          <span className="flex items-center gap-3">
            <span className="bg-lime-bg border-lime-line text-lime flex size-7 items-center justify-center rounded-[7px] border font-mono text-[11px]">
              {step}
            </span>
            <span className="font-display text-lg sm:text-xl">
              {section.title}
            </span>
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="text-muted text-[13px] leading-relaxed">
              {section.intro}
            </p>
            <DescriptionList items={section.facts} />
          </div>
          <CodeBlock code={section.code} label={section.codeLabel} />
        </div>
      </Card>
    </article>
  )
}
