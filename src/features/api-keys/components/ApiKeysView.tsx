import { Callout } from '#/components/ui/Callout'
import { ActiveKeysCard } from './ActiveKeysCard'
import { BestPracticesCard } from './BestPracticesCard'
import { FirstCallCard } from './FirstCallCard'
import { KeyUsageCard } from './KeyUsageCard'
import { ProductionKeysCard } from './ProductionKeysCard'
import { TestKeysCard } from './TestKeysCard'

export function ApiKeysView() {
  return (
    <>
      <Callout tone="warning">
        Você está no ambiente de testes. As chaves abaixo só funcionam em
        Sepolia e Amoy — gere chaves de produção quando a loja for para a
        mainnet.
      </Callout>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_372px]">
        <div className="flex min-w-0 flex-col gap-4">
          <TestKeysCard />
          <ProductionKeysCard />
          <KeyUsageCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ActiveKeysCard />
          <FirstCallCard />
          <BestPracticesCard />
        </div>
      </div>
    </>
  )
}
