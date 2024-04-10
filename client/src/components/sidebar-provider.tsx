import { createContext, useContext, useState } from 'react'

type SidebarProviderState = {
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
}
const initialState: SidebarProviderState = {
  isSidebarOpen: false,
  openSidebar: () => null,
  closeSidebar: () => null,
}

const SidebarContext = createContext<SidebarProviderState>(initialState)

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar() {
  return useContext(SidebarContext)
}

type SidebarProviderProps = {
  children: React.ReactNode
}
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const value = {
    isSidebarOpen,
    openSidebar: () => setSidebarOpen(true),
    closeSidebar: () => setSidebarOpen(false),
  }

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}
