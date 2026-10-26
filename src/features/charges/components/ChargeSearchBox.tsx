import { Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { Input } from '#/components/ui/Input'

type ChargeSearchBoxProps = {
  onSearch: (query: string) => void
  defaultValue?: string
  placeholder?: string
}

/** Search field that hands the query to its parent on submit (Enter). */
export function ChargeSearchBox({
  onSearch,
  defaultValue,
  placeholder = 'Buscar cobrança, pedido ou hash…',
}: ChargeSearchBoxProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('q')
    onSearch(typeof query === 'string' ? query.trim() : '')
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="w-full">
      <Input
        label="Buscar cobranças"
        isLabelHidden
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        trailing={<Search size={14} aria-hidden className="text-dim" />}
      />
    </form>
  )
}
