'use client'

import { Menu, X } from 'lucide-react'
import { Button } from './ui/Button'

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-xl font-semibold">B2B-B2C SaaS</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Account
          </Button>
        </div>
      </div>
    </header>
  )
}
