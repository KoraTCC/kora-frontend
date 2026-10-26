import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { iconButtonClasses } from '#/components/ui/IconButton'
import { AuthHeading } from '#/features/auth/components/AuthHeading'
import { ForgotPasswordForm } from '#/features/auth/components/ForgotPasswordForm'
import { useForgotPasswordForm } from '#/features/auth/hooks/useForgotPasswordForm'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const { handleSubmit, fieldErrors, formError, isSubmitting, isSent } =
    useForgotPasswordForm()

  return (
    <>
      <Link
        to="/auth"
        aria-label="Voltar para o login"
        className={iconButtonClasses}
      >
        <ArrowLeft size={14} aria-hidden />
      </Link>
      <AuthHeading
        title="Esqueci a senha"
        description="Informe o e-mail da conta. Enviaremos um link para você criar uma nova senha. O link vale por 30 minutos."
      />
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSent={isSent}
        fieldErrors={fieldErrors}
        formError={formError}
      />
    </>
  )
}
