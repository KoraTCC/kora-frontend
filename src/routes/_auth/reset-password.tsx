import { createFileRoute } from '@tanstack/react-router'
import { AuthHeading } from '#/features/auth/components/AuthHeading'
import { InvalidResetLink } from '#/features/auth/components/InvalidResetLink'
import { ResetPasswordForm } from '#/features/auth/components/ResetPasswordForm'
import { useResetPasswordForm } from '#/features/auth/hooks/useResetPasswordForm'
import { resetPasswordSearchSchema } from '#/features/auth/schemas'

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token, email } = Route.useSearch()

  if (!token) return <InvalidResetLink />

  return <ResetPasswordStep token={token} email={email} />
}

type ResetPasswordStepProps = {
  token: string
  email?: string
}

function ResetPasswordStep({ token, email }: ResetPasswordStepProps) {
  const { handleSubmit, fieldErrors, formError, isSubmitting } =
    useResetPasswordForm(token)
  const account = email ? (
    <span className="font-mono text-[11px]">{email}</span>
  ) : (
    'sua conta'
  )

  return (
    <>
      <AuthHeading
        title="Criar nova senha"
        description={<>Você está redefinindo a senha de {account}.</>}
      />
      <ResetPasswordForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
      />
    </>
  )
}
