import { createFileRoute } from '@tanstack/react-router'
import { ShaderBackground } from '#/components/ui/ShaderBackground'
import { ForgotPasswordForm } from '#/features/auth/components/ForgotPasswordForm'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
      <main className="bg-canvas text-ink flex min-h-screen w-full flex-col lg:flex-row">
        <section className="border-line-soft relative min-h-80 flex-1 flex-col justify-between gap-10 overflow-hidden p-8 sm:p-12 hidden lg:flex lg:min-h-screen lg:border-r lg:p-14">
          <ShaderBackground />
  
          <p className="font-display text-on-lime relative z-10 text-xl font-bold tracking-tight lg:text-[22px]">
            Kora
          </p>
  
          <div className="relative z-10 flex flex-col gap-4">
            <h1 className="font-display text-on-lime max-w-135 text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Aceite cripto no seu checkout, sem custódia.
            </h1>
            <p className="text-on-lime-soft max-w-115 leading-relaxed">
              A Kora gera um endereço único por cobrança, detecta o
              pagamento na rede e avisa sua loja por webhook. O valor cai
              direto na sua carteira.
            </p>
          </div>
  
          <p className="text-on-lime-dim relative z-10 hidden max-w-120 font-mono text-[11px] leading-relaxed lg:block">
            Nenhuma chave privada passa pelo Kora. A loja recebe direto na
            carteira que ela controla.
          </p>
        </section>
  
        <section className="bg-panel flex w-full h-screen flex-none items-center justify-center p-8 sm:p-12 lg:w-[452px]">
          <div className="flex w-full max-w-100 flex-col gap-[22px]">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-[28px] font-semibold tracking-tight">
                Esqueci a senha
              </h2>
              <p className="text-muted text-sm">Informe o e-mail da conta. Enviaremos um link para você criar uma nova senha. O link vale por 30 minutos.</p>
            </div>
  
            <ForgotPasswordForm />
          </div>
        </section>
      </main>
    )
}
