import { createFileRoute } from '@tanstack/react-router'
import { EmailVerificationPanel } from '#/features/auth/components/EmailVerificationPanel'
import { useEmailVerification } from '#/features/auth/hooks/useEmailVerification'
import { verifyEmailSearchSchema } from '#/features/auth/schemas'

export const Route = createFileRoute('/_auth/verify-email')({
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { email = '' } = Route.useSearch()
  const verification = useEmailVerification(email)

  return (
    <EmailVerificationPanel
      email={email}
      state={verification.state}
      resendSecondsLeft={verification.resendSecondsLeft}
      canResend={verification.canResend}
      onResend={verification.handleResend}
      isResending={verification.isResending}
      hasResendError={verification.hasResendError}
    />
  )
}
