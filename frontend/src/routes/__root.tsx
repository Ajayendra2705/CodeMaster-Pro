import { createRootRoute, Outlet } from '@tanstack/react-router'
import Dashboard from '../pages/Dashboard'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet /> {/* Renders child routes */}
      <Dashboard /> {/* Your dashboard component */}
    </>
  )
})
