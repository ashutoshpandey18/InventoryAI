export interface NavItem {
  label: string
  href: string
  /** icon name from lucide-react (resolved in client) */
  icon?: string
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { label: 'Users', href: '/users', icon: 'Users' },
  { label: 'Documents', href: '/documents', icon: 'FileText' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
]
