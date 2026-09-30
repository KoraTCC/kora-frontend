# Kora — regras do projeto

Checkout de criptomoedas (TCC). Este arquivo é o contrato de como o código é escrito aqui.
Toda contribuição — humana ou do Claude — segue estas regras.

## Stack e comandos

- **TanStack Start** + React 19, **TanStack Router** (file-based), **Tailwind 4**,
  TypeScript estrito, Vite 8.
- ESLint (`@tanstack/eslint-config`) + Prettier (`semi: false`, `singleQuote: true`).
- `npm run dev` (porta 3000) · `build` · `lint` · `format` · `check` · `generate-routes`.

Dois avisos do repo:

- **Nunca editar `src/routeTree.gen.ts`** — é gerado por `tsr generate`.
- Imports internos usam o alias **`#/`** (`#/components/ui/Modal`). Nada de `../../../`.

---

## Regra 1 — componentes reutilizáveis: uma implementação por conceito

Existe **um** `Modal`. Um `Button`. Um `Input`. Nunca `ConfirmModal` + `ErrorModal` +
`PaymentModal` — é o mesmo `Modal` recebendo conteúdo e variante.

- A variação vem de **props e composição**, não de arquivos novos: `variant`, `size`,
  `children`, slots (`header`, `footer`).
- Antes de criar qualquer componente, procure em `src/components/ui/`. Se já existe algo
  parecido, **estenda** (nova prop ou variante) em vez de duplicar.
- `components/ui` é **agnóstico de domínio**. Se o componente precisa saber o que é
  "pagamento" ou "carteira", ele está no lugar errado.
- Wrapper de domínio é permitido e encorajado — `ConfirmPaymentDialog` em
  `features/checkout/components/` — **desde que componha o `Modal` único** e não
  reimplemente overlay, foco ou animação.

```tsx
// ✅ um Modal serve todos os casos
<Modal open={isOpen} onClose={close} title="Confirmar pagamento" size="sm">
  <PaymentSummary order={order} />
</Modal>

// ❌ um arquivo por caso de uso
<ConfirmPaymentModal ... />
<PaymentErrorModal ... />
```

---

## Regra 2 — separação de responsabilidade e componentização

As dependências apontam sempre para baixo. Nenhuma camada pula a de cima.

| Camada     | Onde                                     | Responsabilidade                    | Proibido                      |
| ---------- | ---------------------------------------- | ----------------------------------- | ----------------------------- |
| Rota       | `src/routes/`                            | compor, loader, search params       | regra de negócio, JSX extenso |
| Componente | `features/*/components`, `components/ui` | renderizar a partir de props        | `fetch`, regra de negócio     |
| Hook       | `features/*/hooks`, `src/hooks`          | estado, orquestração, efeitos       | JSX                           |
| Service    | `features/*/services`                    | I/O HTTP, contrato da API           | React, estado de UI           |
| Lib        | `src/lib`                                | funções puras (format, money, http) | React, I/O                    |

- Service **não importa React**. Componente **não chama `fetch`** — chama um hook.
- Componente com mais de ~150 linhas, ou com mais de uma razão para mudar, é dividido.

```
src/
  components/ui/       Modal, Button, Input, Badge, StatusPill…  (agnósticos)
  components/layout/   Header, Footer, Shell
  features/<domain>/   components/ hooks/ services/ types.ts
  hooks/               genéricos e reutilizáveis
  lib/                 format, http, utils (puros)
  routes/              só composição
```

---

## Regra 3 — nada de lógica no JSX; early return sempre que couber

O JSX **descreve**, não decide. O valor chega pronto.

Proibido dentro do `return`: ternário aninhado, `&&` encadeado, `.filter().map()` com regra
dentro, cálculo, `new Date()`, formatação inline.

O valor vem de uma variável nomeada acima do return, de uma função pura em `lib/`, ou de um
hook.

**Early return** para cada estado, antes do corpo principal:

```tsx
// ✅
function TransactionList() {
  const { data, isLoading, error } = useTransactions()

  if (isLoading) return <Skeleton />
  if (error) return <ErrorState error={error} />
  if (!data.length) return <EmptyState />

  return <ul>{data.map(renderRow)}</ul>
}

// ❌ um return com a decisão dentro
return isLoading ? (
  <Skeleton />
) : error ? (
  <ErrorState />
) : data.length ? (
  <ul>…</ul>
) : (
  <Empty />
)
```

Em funções: guard clauses primeiro, caminho feliz sem indentação. Mais de duas variantes de
renderização → mapa de componentes ou `switch` numa função auxiliar, nunca cadeia de
ternários.

---

## Regra 4 — todo código em inglês

O código é escrito **inteiramente em inglês**. Só o texto que o usuário lê fica em
português.

Em inglês, sem exceção:

- nomes de componentes, arquivos e pastas — `PaymentSummary.tsx`, `features/checkout/`;
- variáveis, funções, props, hooks, tipos, campos de schema — `isLoading`, `onClose`,
  `useTransactions`, `WalletAddress`, `amount`;
- chaves de query, rotas, constantes e valores de enum — `'pending'`, `'confirmed'`;
- comentários, mensagens de commit e nomes de teste.

Em português, porque é o que o usuário lê:

- labels, títulos, textos de botão e mensagens de erro na tela;
- conteúdo de tradução/copy;
- este arquivo e a documentação do TCC.

```tsx
// ✅ código em inglês, copy em português
function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === 'expired') return <Alert>Este pagamento expirou.</Alert>
  return <Badge tone="success">Pagamento confirmado</Badge>
}

// ❌ identificadores em português
function StatusPagamento({ situacao }: { situacao: SituacaoPagamento }) { … }
```

Um termo do domínio que não tem tradução estabelecida em inglês pode ficar como está, desde
que seja consistente no projeto inteiro — decida uma vez e documente aqui.

---

## Regra 5 — telas e componentes sempre responsivos

Toda tela e todo componente funcionam de 360px até desktop. Não existe "depois eu
adapto": a versão responsiva nasce junto com a tela, não numa passada posterior.

- **Mobile primeiro.** A classe sem prefixo é a do celular; `sm:`, `md:`, `lg:` só
  adicionam a partir dali. Nunca o contrário.
- **Nada de largura fixa em layout.** `w-[600px]` vira `w-full lg:w-[600px]`;
  `w-[70%]` vira `flex-1`. Largura fixa só em elemento que realmente tem tamanho
  fixo (ícone, avatar, checkbox).
- **Toda linha quebra ou empilha.** `flex-row` sem `flex-col` antes só se couber em
  360px. O padrão é `flex-col lg:flex-row`.
- **Nunca rolagem horizontal.** Só tabela, gráfico e bloco de código podem passar da
  largura, cada um no seu contêiner com `overflow-x-auto`.
- **Tipografia e espaçamento escalam** — `text-3xl lg:text-5xl`, `p-6 lg:p-20`, ou
  `clamp()` quando a variação for contínua.
- **Alvo de toque de 44px** no mínimo para qualquer controle clicável no mobile.
- **Componente não impõe largura nem altura de página.** Ele preenche o que o pai
  der. `h-screen` e `w-[…]` pertencem à tela, não ao componente de `components/ui`.
- Antes de considerar pronto: conferir em **360px, 768px e 1280px**.

---

## Boas práticas

### TypeScript

- `any` é proibido — use `unknown` + narrowing.
- Props tipadas com `type`, no mesmo arquivo do componente.
- Estado com mais de dois casos vira **discriminated union**
  (`{ status: 'idle' } | { status: 'error'; error: E }`), não três booleanos soltos.
- `noUnusedLocals` e `noUnusedParameters` estão ligados — não contorne com `_`.

### Estado

- Dado de servidor → **TanStack Query**. Nunca `useEffect` + `useState` para buscar.
- Estado de UI → `useState` local, o mais perto possível de onde é usado.
- Filtro, paginação, aba → **search params** do TanStack Router, para a URL ser
  compartilhável.
- Estado global só com necessidade real e justificada.

### Contrato de API

- **Zod** valida toda resposta de API antes de chegar na tela.
- Os tipos do domínio são **derivados** do schema (`z.infer`), nunca escritos duas vezes.

### Estilo

- Só tokens do design system: `var(--kora-*)`, `--status-*`, `--radius-*`, `--space-*`,
  `--elev-*`. **Hex solto no JSX é proibido.**
- Tailwind para layout e espaçamento. `styles.css` só recebe token novo ou primitiva
  realmente global.
- Tipografia: `--font-display` (títulos), `--font-sans` (corpo), `--font-mono` (hash,
  endereço, valor, label uppercase).

### Acessibilidade

- HTML semântico antes de `div`.
- O `Modal` único resolve foco preso, `Esc`, `aria-modal` e retorno de foco — **uma vez,
  para todos**. Esse é o maior ganho da regra 1.
- Todo controle tem nome acessível.
- Nada depende só de cor: status leva ícone ou texto junto.

### Estados de dados

Todo componente que consome dados trata **loading, erro e vazio**. Não existe tela que só
funciona no caminho feliz. `catch` silencioso é proibido.

### Formulários

Controlados por um hook do domínio, validados por Zod. A mensagem de erro é copy — fica em
português — e é ligada ao campo por `aria-describedby`.

### Performance

- `key` estável — **nunca** o índice do array.
- `memo` / `useMemo` só com problema medido.
- `React.lazy` em rota pesada.

### Nomenclatura

- Tudo em inglês (ver Regra 4).
- Componente: `PascalCase.tsx`, um por arquivo.
- Hook: `useThing.ts` · Service: `thing.service.ts` · Puro: `lib/thing.ts`.
- Booleano com prefixo (`isOpen`, `hasError`); handler com `on`/`handle`
  (`onClose`, `handleSubmit`).

### Segurança

- Sem `dangerouslySetInnerHTML`. A exceção existente é o `THEME_INIT_SCRIPT` em
  `src/routes/__root.tsx` (string estática); qualquer nova precisa de justificativa.
- Segredo nunca no client.
- Resposta de API sempre validada antes de renderizar.

### Testes

**Vitest + Testing Library.** Testar comportamento (query por role/label), não
implementação. Todo componente de `components/ui` e toda função de `lib/` com teste.

### Dependências

Não adicionar pacote sem justificar. Preferir o que já existe no ecossistema TanStack.

---

## Ao trabalhar neste repo

1. Procurar o componente existente antes de criar um novo.
2. Nova variante = nova prop, não novo arquivo.
3. Tirar a lógica do JSX; early return para loading, erro e vazio.
4. Respeitar as camadas: rota → componente → hook → service → lib.
5. Código em inglês; só a copy da tela em português.
6. Responsivo desde o primeiro commit: conferir em 360px, 768px e 1280px.
7. Cores e espaçamentos só pelos tokens Kora.
8. Não tocar em `src/routeTree.gen.ts`.
9. Terminar com `npm run lint` e `npm run build` passando.
