export type CodeTokenKind = 'key' | 'string' | 'number' | 'plain'

export type CodeToken = {
  text: string
  kind: CodeTokenKind
}

// A quoted string (optionally followed by `:`, making it a key) or a number.
const TOKEN_PATTERN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)/g

/**
 * Splits one line of JSON-like code into tokens for light syntax colouring.
 * Not a parser — just enough for the request/response samples in the UI.
 */
export function tokenizeCodeLine(line: string): Array<CodeToken> {
  const tokens: Array<CodeToken> = []
  let cursor = 0

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const [whole, quoted, colon, number] = match
    const start = match.index
    if (start > cursor) {
      tokens.push({ text: line.slice(cursor, start), kind: 'plain' })
    }

    if (number) tokens.push({ text: number, kind: 'number' })
    if (quoted && colon) tokens.push({ text: quoted, kind: 'key' })
    if (quoted && !colon) tokens.push({ text: quoted, kind: 'string' })
    if (colon) tokens.push({ text: colon, kind: 'plain' })

    cursor = start + whole.length
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), kind: 'plain' })
  }
  return tokens
}
