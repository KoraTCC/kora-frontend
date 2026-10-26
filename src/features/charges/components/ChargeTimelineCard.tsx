import { Card } from '#/components/ui/Card'
import { Timeline } from '#/components/ui/Timeline'
import type { TimelineItem } from '#/components/ui/Timeline'
import { formatDayTime } from '#/lib/date'
import type { ChargeDetail } from '../types'

type ChargeTimelineCardProps = {
  events: ChargeDetail['timeline']
}

export function ChargeTimelineCard({ events }: ChargeTimelineCardProps) {
  const items: Array<TimelineItem> = events.map((event) => ({
    id: event.id,
    title: event.title,
    meta: `${formatDayTime(event.at)} · ${event.detail}`,
    state: event.state,
  }))

  return (
    <Card title="Linha do tempo">
      <Timeline items={items} />
    </Card>
  )
}
