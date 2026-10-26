import { createFileRoute } from '@tanstack/react-router'
import { AuthHeading } from '#/features/auth/components/AuthHeading'
import { LoginForm } from '#/features/auth/components/LoginForm'
import { TwoFactorDialog } from '#/features/auth/components/TwoFactorDialog'
import { useLoginForm } from '#/features/auth/hooks/useLoginForm'
import { useTwoFactorForm } from '#/features/auth/hooks/useTwoFactorForm'
import { loginSearchSchema } from '#/features/auth/schemas'

export const Route = createFileRoute('/_auth/auth')({
  validateSearch: loginSearchSchema,
  component: LoginPage,
})

function LoginPage() {
  const { step } = Route.useSearch()
  const { handleSubmit, fieldErrors, formError, isSubmitting } = useLoginForm()

  return (
    <>
      <AuthHeading title="Entrar" description="Acesse o painel da sua loja." />
      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
      />
      {step === 'two-factor' ? <TwoFactorStep /> : null}
    </>
  )
}

/** Mounted only while open, so the resend cooldown starts with the dialog. */
function TwoFactorStep() {
  const navigate = Route.useNavigate()
  const twoFactor = useTwoFactorForm()

  function handleClose() {
    void navigate({ search: {}, replace: true })
  }

  return (
    <TwoFactorDialog
      open
      onClose={handleClose}
      code={twoFactor.code}
      onCodeChange={twoFactor.handleCodeChange}
      codeError={twoFactor.codeError}
      formError={twoFactor.formError}
      onSubmit={twoFactor.handleSubmit}
      isSubmitting={twoFactor.isSubmitting}
      resendSecondsLeft={twoFactor.resendSecondsLeft}
      onResend={twoFactor.handleResend}
      isResending={twoFactor.isResending}
    />
  )
}
