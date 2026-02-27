'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'

interface HeaderProps {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

interface UserData {
  name?: string | null
  email: string
  role: string
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/signin')
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? '??'

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
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-xl font-bold text-slate-900 tracking-tight">InventoryAI</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-none">{user?.name ?? 'Loading…'}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-none">{user?.email ?? ''}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user?.name ?? '—'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                  <span className="mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium capitalize">{user?.role?.toLowerCase()}</span>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); router.push('/dashboard/settings') }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
