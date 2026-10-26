import { createFileRoute } from '@tanstack/react-router'
import { TeamSettings } from '#/features/settings/components/TeamSettings'

export const Route = createFileRoute('/_app/settings/team')({
  component: TeamSettings,
})
