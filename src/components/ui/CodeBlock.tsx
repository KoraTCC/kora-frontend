import { tokenizeCodeLine } from '#/lib/codeTokens'
import type { CodeTokenKind } from '#/lib/codeTokens'

type CodeBlockProps = {
  code: string
  /** Accessible name — "Exemplo de requisição". */
  label: string
}

const TOKEN_CLASSES: Record<CodeTokenKind, string> = {
  key: 'text-lime',
  string: 'text-status-pending',
  number: 'text-status-pending',
  plain: '',
}

/** Code sample with light JSON colouring. Scrolls inside itself on narrow screens. */
export function CodeBlock({ code, label }: CodeBlockProps) {
  const lines = code.split('\n').map((line, lineIndex) => ({
    // Lines are static text that never reorders: position is the identity.
    id: `line-${lineIndex}`,
    tokens: tokenizeCodeLine(line).map((token, tokenIndex) => ({
      ...token,
      id: `token-${tokenIndex}`,
    })),
  }))

  return (
    <pre
      aria-label={label}
      className="bg-canvas border-line text-ink-soft overflow-x-auto rounded-[10px] border p-4 font-mono text-[11px] leading-[1.7]"
    >
      <code>
        {lines.map((line) => (
          <span key={line.id} className="block min-h-[1lh]">
            {line.tokens.map((token) => (
              <span key={token.id} className={TOKEN_CLASSES[token.kind]}>
                {token.text}
              </span>
            ))}
          </span>
        ))}
      </code>
    </pre>
  )
}
