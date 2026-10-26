import type { ReactNode } from 'react'
import { ShaderBackground } from '#/components/ui/ShaderBackground'

type AuthLayoutProps = {
  children: ReactNode
}

/** Pitch panel on the left (desktop only) + the auth form panel. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-canvas text-ink flex min-h-screen w-full flex-col lg:flex-row">
      <section className="border-line-soft relative hidden flex-1 flex-col justify-between gap-10 overflow-hidden p-14 lg:flex lg:min-h-screen lg:border-r">
        <ShaderBackground />

        <p className="font-display text-on-lime relative z-10 text-[22px] font-bold tracking-tight">
          Kora
        </p>

        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="font-display text-on-lime max-w-135 text-5xl leading-[1.05] font-semibold tracking-tight">
            Aceite cripto no seu checkout, sem custódia.
          </h1>
          <p className="text-on-lime-soft max-w-115 leading-relaxed">
            A Kora gera um endereço único por cobrança, detecta o pagamento na
            rede e avisa sua loja por webhook. O valor cai direto na sua
            carteira.
          </p>
        </div>

        <p className="text-on-lime-dim relative z-10 max-w-120 font-mono text-[11px] leading-relaxed">
          Ambiente de testes · Sepolia e Amoy · nenhum valor real é movimentado.
        </p>
      </section>

      <section className="bg-panel flex min-h-screen w-full flex-none flex-col items-center justify-center gap-10 px-6 py-10 sm:p-12 lg:w-[452px]">
        <p className="font-display text-ink self-start text-xl font-bold tracking-tight sm:self-center lg:hidden">
          Kora
        </p>
        <div className="flex w-full max-w-100 flex-col gap-[22px]">
          {children}
        </div>
      </section>
    </main>
  )
}
