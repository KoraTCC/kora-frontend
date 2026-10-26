import { createFileRoute } from '@tanstack/react-router'
import { WalletSettings } from '#/features/settings/components/WalletSettings'

export const Route = createFileRoute('/_app/settings/wallets')({
  component: WalletSettings,
})
