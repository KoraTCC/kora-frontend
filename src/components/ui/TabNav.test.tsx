import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TabNav } from './TabNav'

function renderAt(path: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <TabNav
        label="Seções"
        items={[
          { label: 'Perfil', to: '/settings/profile' },
          { label: 'Equipe', to: '/settings/team' },
        ]}
      />
    ),
  })
  const routeTree = rootRoute.addChildren(
    ['/settings/profile', '/settings/team'].map((routePath) =>
      createRoute({ getParentRoute: () => rootRoute, path: routePath }),
    ),
  )
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  return render(<RouterProvider router={router} />)
}

describe('TabNav', () => {
  it('marks the tab of the current route', async () => {
    renderAt('/settings/team')
    const nav = await screen.findByRole('navigation', { name: 'Seções' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Equipe' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Perfil' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
