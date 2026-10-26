import { Card } from '#/components/ui/Card'
import { ErrorState } from '#/components/ui/ErrorState'
import { FormError } from '#/components/ui/FormError'
import { Skeleton } from '#/components/ui/Skeleton'
import { Switch } from '#/components/ui/Switch'
import { NETWORK_META } from '#/features/networks/networks'
import type { NetworkSetting } from '#/features/wallets/types'

type NetworksFormProps = {
  settings?: ReadonlyArray<NetworkSetting>
  isPending: boolean
  isError: boolean
  onRetry: () => void
  error?: string
}

/** Fields of the wallets tab form: which networks the checkout accepts. */
export function NetworksForm({
  settings,
  isPending,
  isError,
  onRetry,
  error,
}: NetworksFormProps) {
  if (isPending)
    return (
      <Card title="Redes aceitas no checkout">
        <Skeleton lines={3} />
      </Card>
    )
  if (isError || !settings)
    return (
      <Card title="Redes aceitas no checkout">
        <ErrorState onRetry={onRetry} />
      </Card>
    )

  return (
    <Card title="Redes aceitas no checkout">
      {settings.map((setting) => (
        <div key={setting.network} className="flex items-center gap-3">
          <Switch
            layout="boxed"
            name="enabledNetworks"
            value={setting.network}
            label={NETWORK_META[setting.network].fullLabel}
            defaultChecked={setting.isEnabled}
            className="flex-1"
          />
          <span className="text-dim hidden font-mono text-[10px] sm:inline">
            {NETWORK_META[setting.network].requiredConfirmations} confirmações
          </span>
        </div>
      ))}
      <FormError message={error} />
    </Card>
  )
}
