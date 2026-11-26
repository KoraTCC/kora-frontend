import { Button } from '#/components/ui/Button'
import { Callout } from '#/components/ui/Callout'
import { useCopyToClipboard } from '#/hooks/useCopyToClipboard'
import { useFileDownload } from '#/hooks/useFileDownload'

type RecoveryCodesPanelProps = {
  codes: ReadonlyArray<string>
}

/** The recovery codes, shown once, with copy and download. */
export function RecoveryCodesPanel({ codes }: RecoveryCodesPanelProps) {
  const { state, copy } = useCopyToClipboard()
  const download = useFileDownload()
  const asText = codes.join('\n')

  function handleDownload() {
    const content = [
      'Kora — códigos de recuperação da verificação em duas etapas',
      'Cada código vale uma vez. Guarde em um lugar seguro.',
      '',
      asText,
      '',
    ].join('\n')
    download('kora-codigos-de-recuperacao.txt', content, 'text/plain')
  }

  return (
    <div className="flex flex-col gap-4">
      <Callout tone="warning">
        Guarde estes códigos agora: eles não aparecem de novo. Cada um libera o
        login uma vez se você perder o celular.
      </Callout>
      <ul className="bg-surface border-line grid grid-cols-2 gap-x-6 gap-y-2 rounded-[14px] border p-4">
        {codes.map((code) => (
          <li key={code} className="text-ink text-center font-mono text-sm">
            {code}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={() => void copy(asText)}>
          {state === 'copied' ? 'Copiados' : 'Copiar'}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleDownload}>
          Baixar .txt
        </Button>
      </div>
    </div>
  )
}
