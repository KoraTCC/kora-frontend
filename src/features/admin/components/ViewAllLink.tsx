import { Link } from '@tanstack/react-router'

type ViewAllLinkProps = {
  to: '/admin/merchants' | '/admin/audit' | '/admin/charges'
  label: string
}

export function ViewAllLink({ to, label }: ViewAllLinkProps) {
  return (
    <Link to={to} className="text-lime font-mono text-[10px]">
      {label}
    </Link>
  )
}
