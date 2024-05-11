import { Bell as NotifIcon, BellOff as NotifOffIcon, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SidebarNavigation from './SidebarNavigation'
// import { ThemeModeToggle } from './mode-toggle'
import { useNotifications } from '@/hooks/useNotifications'
import { useSidebar } from './sidebar-provider'
import QuickSettingsTrigger from '@/pages/settings/QuickSettingsTrigger'

const Navbar = () => {
  const { isSidebarOpen, closeSidebar, openSidebar } = useSidebar()
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet
        open={isSidebarOpen}
        onOpenChange={(open) => (open ? openSidebar() : closeSidebar())}
      >
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SidebarNavigation />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form> */}
      </div>
      <div className="flex items-center gap-2">
        <NotificationIcon />
        {/* <ThemeModeToggle /> */}
        <QuickSettingsTrigger />
      </div>
    </header>
  )
}

export default Navbar

const NotificationIcon = () => {
  const { permission, register, unregister } = useNotifications()

  // if (permission === 'granted') return null

  return permission === 'granted' ? (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={unregister}
    >
      <NotifOffIcon className="h-5 w-5 text-destructive" />
    </Button>
  ) : (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={register}
    >
      <NotifIcon className="h-5 w-5 text-primary" />
    </Button>
  )
}
