'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, AlertTriangle, X, User, Store, Shield, Plus, Pencil, Trash2 } from 'lucide-react'

interface UserData { id: string; name: string; email: string; role: string; createdAt: string }
interface StoreData { id: string; name: string; createdAt: string }

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      {msg}
      <button onClick={onClose}><X className="h-4 w-4 opacity-70 hover:opacity-100" /></button>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-indigo-50"><Icon className="h-4 w-4 text-indigo-600" /></div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [stores, setStores] = useState<StoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Profile form state
  const [profileName, setProfileName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password form state
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [savingPw, setSavingPw] = useState(false)

  // Store editing state
  const [editingStore, setEditingStore] = useState<string | null>(null)
  const [editStoreName, setEditStoreName] = useState('')
  const [savingStore, setSavingStore] = useState(false)

  // New store
  const [newStoreName, setNewStoreName] = useState('')
  const [addingStore, setAddingStore] = useState(false)
  const [showAddStore, setShowAddStore] = useState(false)

  const notify = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/stores').then(r => r.json()),
    ]).then(([userData, storeData]) => {
      if (userData.user) { setUser(userData.user); setProfileName(userData.user.name ?? '') }
      if (Array.isArray(storeData)) setStores(storeData)
    }).finally(() => setLoading(false))
  }, [])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingProfile(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setUser(data.user); notify('Profile updated!')
    } catch (err) { notify(err instanceof Error ? err.message : 'Failed', 'error') }
    finally { setSavingProfile(false) }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPwError('')
    if (pw.next.length < 6) return setPwError('New password must be at least 6 characters')
    if (pw.next !== pw.confirm) return setPwError('Passwords do not match')
    setSavingPw(true)
    try {
      // Re-login to verify old password (simplest approach: try login with current creds)
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, password: pw.current }),
      })
      if (!loginRes.ok) throw new Error('Current password is incorrect')
      // Note: Full password change API would require a dedicated endpoint
      // For now we surface a clear message
      notify('Password change endpoint not yet connected — backend endpoint needed', 'error')
      setPw({ current: '', next: '', confirm: '' })
    } catch (err) { setPwError(err instanceof Error ? err.message : 'Failed') }
    finally { setSavingPw(false) }
  }

  const saveStoreName = async (storeId: string) => {
    setSavingStore(true)
    try {
      const res = await fetch(`/api/stores/${storeId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editStoreName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setStores(prev => prev.map(s => s.id === storeId ? { ...s, name: data.name } : s))
      setEditingStore(null); notify('Store name updated!')
    } catch (err) { notify(err instanceof Error ? err.message : 'Failed', 'error') }
    finally { setSavingStore(false) }
  }

  const addStore = async (e: React.FormEvent) => {
    e.preventDefault(); setAddingStore(true)
    try {
      const res = await fetch('/api/stores', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStoreName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setStores(prev => [...prev, data]); setNewStoreName(''); setShowAddStore(false); notify('Store created!')
    } catch (err) { notify(err instanceof Error ? err.message : 'Failed', 'error') }
    finally { setAddingStore(false) }
  }

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center"><RefreshCw className="h-6 w-6 text-indigo-400 animate-spin mx-auto mb-2" /><p className="text-sm text-slate-500">Loading settings…</p></div>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-5 max-w-2xl">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account and store preferences</p>
      </div>

      {/* Profile */}
      <SectionCard title="Profile" icon={User}>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input value={profileName} onChange={e => setProfileName(e.target.value)} required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input value={user?.email ?? ''} disabled
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={savingProfile}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              {savingProfile ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />Saving…</> : 'Save Profile'}
            </button>
            <div className="text-xs text-slate-400">
              <span className="font-medium text-slate-500">Role:</span> {user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) ?? '')}
              &nbsp;&middot;&nbsp;Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </div>
          </div>
        </form>
      </SectionCard>

      {/* Stores */}
      <SectionCard title="Stores" icon={Store}>
        <div className="space-y-3">
          {stores.map(store => (
            <div key={store.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50 group">
              {editingStore === store.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input autoFocus value={editStoreName} onChange={e => setEditStoreName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => saveStoreName(store.id)} disabled={savingStore}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:bg-slate-300">
                    {savingStore ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}Save
                  </button>
                  <button onClick={() => setEditingStore(null)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-white">Cancel</button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{store.name}</p>
                    <p className="text-xs text-slate-400">Created {new Date(store.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingStore(store.id); setEditStoreName(store.name) }}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-indigo-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                  </div>
                </>
              )}
            </div>
          ))}

          {showAddStore ? (
            <form onSubmit={addStore} className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50">
              <input autoFocus value={newStoreName} onChange={e => setNewStoreName(e.target.value)} required placeholder="New store name…"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
              <button type="submit" disabled={addingStore}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:bg-slate-300">
                {addingStore ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}Create
              </button>
              <button type="button" onClick={() => setShowAddStore(false)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-white bg-white">Cancel</button>
            </form>
          ) : (
            <button onClick={() => setShowAddStore(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
              <Plus className="h-4 w-4" />Add Store
            </button>
          )}
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security" icon={Shield}>
        <form onSubmit={changePassword} className="space-y-4">
          <p className="text-xs text-slate-500">Change your account password. You&apos;ll need your current password to verify.</p>
          {[
            { key: 'current', label: 'Current Password' },
            { key: 'next', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input type="password" value={(pw as any)[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          {pwError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{pwError}</p>}
          <button type="submit" disabled={savingPw}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            {savingPw ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />Saving…</> : 'Change Password'}
          </button>
        </form>
      </SectionCard>
    </div>
  )
}
