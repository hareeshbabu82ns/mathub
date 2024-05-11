import {
  Home,
  Sliders as Abacus,
  Sigma as Arithmetic,
  CogIcon as Settings,
} from 'lucide-react'

export const sidebarNavItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    path: '/',
  },
  {
    title: 'Arithmetic',
    Icon: Arithmetic,
    path: '/arithmetic',
    badge: 6,
  },
  {
    title: 'Abacus',
    Icon: Abacus,
    path: '/abacus',
  },
  {
    title: 'Settings',
    Icon: Settings,
    path: '/settings',
  },
]
