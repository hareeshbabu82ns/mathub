import SidebarNavigation, {
  SidebarCondensedNavigation,
} from './SidebarNavigation'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from './sidebar-provider'

export function SimplePageLayout() {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[56px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 lg:block">
          <SidebarNavigation />
        </div>
        <div className="hidden border-r bg-muted/40 md:block lg:hidden">
          <SidebarCondensedNavigation />
        </div>
        <div className="flex flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
