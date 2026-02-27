'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationItems } from '@/config/navigation'
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Package,
  ShoppingCart,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

const ICONS: Record<string, any> = {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Package,
  ShoppingCart,
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const Icon = (item.icon && ICONS[item.icon]) || LayoutDashboard
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
