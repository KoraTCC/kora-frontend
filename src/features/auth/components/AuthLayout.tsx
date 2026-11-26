import type { ReactNode } from 'react'
import { KoraMark } from '#/components/layout/KoraMark'
import { CoinRibbonScene } from './CoinRibbonScene'

type AuthLayoutProps = {
  children: ReactNode
}

/**
 * Auth form panel on the left + animated pitch panel (desktop only).
 * Always light, whatever the app theme (`kora-light` scopes the light tokens).
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="kora-light bg-canvas text-ink flex min-h-screen w-full flex-col lg:flex-row">
      <section className="bg-panel border-line-soft flex min-h-screen w-full flex-none flex-col justify-between gap-10 px-6 py-8 sm:p-12 lg:w-[452px] lg:border-r">
        <div className="flex items-center gap-2.5 lg:gap-3 2xl:gap-3.5">
          <KoraMark className="lg:h-10 lg:w-[35px] 2xl:h-12 2xl:w-[42px]" />
          <p className="font-display text-xl font-bold tracking-tight lg:text-[26px] 2xl:text-[32px]">
            Kora
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-100 flex-col gap-[22px]">
          {children}
        </div>

        <p className="text-dim font-mono text-[11px] leading-relaxed">
          Ambiente de testes · Sepolia e Amoy · nenhum valor real é movimentado.
        </p>
      </section>

      <section className="from-stage-top to-stage bg-stage relative hidden flex-1 flex-col justify-end overflow-hidden bg-linear-to-b to-70% lg:flex lg:min-h-screen">
        <CoinRibbonScene tone="light" />

        <div className="from-stage relative z-10 flex flex-col gap-4 bg-linear-to-t from-35% to-transparent p-14">
          <h1 className="font-display text-stage-ink max-w-140 text-5xl leading-[1.05] font-semibold tracking-tight">
            Aceite cripto no seu checkout,{' '}
            <span className="text-stage-accent">sem custódia.</span>
          </h1>
          <p className="text-stage-ink-soft max-w-115 leading-relaxed">
            A Kora gera um endereço único por cobrança, detecta o pagamento na
            rede e avisa sua loja por webhook. O valor cai direto na sua
            carteira.
          </p>
        </div>
      </section>
    </main>
  )
}
