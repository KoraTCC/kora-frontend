import { Link } from '@tanstack/react-router'
import { buttonClasses } from '#/components/ui/Button'
import { AuthHeading } from './AuthHeading'

export function InvalidResetLink() {
  return (
    <>
      <AuthHeading
        title="Link inválido"
        description="Este link de redefinição está incompleto ou expirou. Peça um novo para continuar."
      />
      <Link to="/forgot-password" className={buttonClasses({ isBlock: true })}>
        Pedir novo link
      </Link>
    </>
  )
}
