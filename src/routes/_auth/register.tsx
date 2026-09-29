import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

// TODO: tela ainda não desenhada — existe para o link do login ter destino.
function RegisterPage() {
  return (
    <main className="bg-canvas text-ink grid min-h-screen place-items-center p-6">
      <h1 className="font-display text-2xl font-semibold">Criar conta</h1>
    </main>
  )
}
