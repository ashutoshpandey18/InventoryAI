export interface NavItem {
  label: string
  href: string
  /** icon name from lucide-react (resolved in client) */
  icon?: string
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/dashboard/products', icon: 'Package' },
  { label: 'Sales', href: '/dashboard/sales', icon: 'ShoppingCart' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
]
