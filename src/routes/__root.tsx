import { QueryClientProvider } from '@tanstack/react-query'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { queryClient } from '#/lib/queryClient'
import appCss from '../styles.css?url'

// Runs before paint so there is no flash. Light by default, like the login
// screen; `localStorage.theme` (see #/lib/theme) switches it to dark.
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=stored==='dark'?'dark':'light';var root=document.documentElement;root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`

export type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kora',
      },
      { name: 'theme-color', content: '#f4f7f1' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      // Gerados por scripts/generate-icons.mjs a partir do logo.
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased  ">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
