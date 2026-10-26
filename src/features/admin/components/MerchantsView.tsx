import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { FormError } from '#/components/ui/FormError'
import { Modal } from '#/components/ui/Modal'
import { PillGroup } from '#/components/ui/PillGroup'
import { useAdminMerchants, useSuspendMerchants } from '../hooks/useAdmin'
import { merchantsSearchSchema } from '../schemas'
import type { MerchantPage, MerchantsSearch } from '../types'
import { MerchantsBody } from './MerchantsBody'

export const MERCHANTS_PAGE_SIZE = 8

type MerchantsViewProps = {
  search: MerchantsSearch
  onSearchChange: (next: MerchantsSearch) => void
}

export function MerchantsView({ search, onSearchChange }: MerchantsViewProps) {
  const query = useAdminMerchants(search, MERCHANTS_PAGE_SIZE)
  const suspend = useSuspendMerchants()
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const selectionLabel = `${selectedIds.size} selecionado${selectedIds.size === 1 ? '' : 's'}`
  const suspendError = suspend.isError
    ? 'Não foi possível suspender.'
    : undefined

  function handleToggle(merchantId: string) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(merchantId)) next.delete(merchantId)
      else next.add(merchantId)
      return next
    })
  }

  function handleStatusChange(value: string) {
    const parsed = merchantsSearchSchema.shape.status.safeParse(value)
    onSearchChange({
      ...search,
      status: parsed.success ? parsed.data : undefined,
      page: undefined,
    })
  }

  function handleConfirmSuspend() {
    suspend.mutate([...selectedIds], {
      onSuccess: () => {
        setSelectedIds(new Set())
        setIsConfirmOpen(false)
      },
    })
  }

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {query.data ? (
          <PillGroup
            label="Filtrar por status"
            options={buildStatusOptions(query.data.counts)}
            value={search.status ?? 'all'}
            onChange={handleStatusChange}
          />
        ) : null}
        <div className="flex items-center gap-3">
          <span className="text-dim font-mono text-[10px]">
            {selectionLabel}
          </span>
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedIds.size}
            onClick={() => setIsConfirmOpen(true)}
          >
            Suspender selecionados
          </Button>
        </div>
      </div>

      <Card isFlush>
        <MerchantsBody
          query={query}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onPageChange={(page) => onSearchChange({ ...search, page })}
        />
      </Card>

      <Modal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={`Suspender ${selectionLabel}?`}
        description="O checkout desses lojistas sai do ar e as chaves de API param de funcionar até a reativação."
        size="sm"
        footer={
          <>
            <Button
              variant="danger"
              isBlock
              onClick={handleConfirmSuspend}
              disabled={suspend.isPending}
            >
              Suspender
            </Button>
            <Button
              variant="ghost"
              isBlock
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <FormError message={suspendError} />
      </Modal>
    </>
  )
}

function buildStatusOptions(counts: MerchantPage['counts']) {
  return [
    { value: 'all', label: `Todos · ${counts.all}` },
    { value: 'active', label: `Ativos · ${counts.active}` },
    { value: 'review', label: `Em análise · ${counts.review}` },
    { value: 'suspended', label: `Suspensos · ${counts.suspended}` },
  ]
}
