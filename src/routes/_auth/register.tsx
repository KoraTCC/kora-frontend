import { createFileRoute } from '@tanstack/react-router'
import { Captcha } from '#/components/ui/Captcha'
import { AuthHeading } from '#/features/auth/components/AuthHeading'
import { RegisterForm } from '#/features/auth/components/RegisterForm'
import { useRegisterForm } from '#/features/auth/hooks/useRegisterForm'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { handleSubmit, fieldErrors, formError, isSubmitting, captcha } =
    useRegisterForm()

  return (
    <>
      <AuthHeading
        title="Criar conta"
        description="Comece a aceitar cripto em poucos minutos."
      />
      <RegisterForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        fieldErrors={fieldErrors}
        formError={formError}
        captcha={
          <Captcha
            containerRef={captcha.containerRef}
            isEnabled={captcha.isEnabled}
            hasLoadError={captcha.hasLoadError}
          />
        }
      />
    </>
  )
}
