'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Package, AlertTriangle, TrendingUp, TrendingDown,
  Sparkles, Send, Plus, Store, RefreshCw, ChevronDown,
  ArrowRight, Zap, BarChart3,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoreData {
  id: string
  name: string
  slug: string
  createdAt: string
}

interface DashboardSummary {
  totalProducts: number
  totalStock: number
  lowStockCount: number
  deadStockCount: number
}

interface LowStockItem {
  productId: string
  name: string
  sku: string
  currentStock: number
  reorderPoint: number
  daysLeft: number | null
  reason: string
}

interface ReorderSuggestion {
  productId: string
  name: string
  sku: string
  currentStock: number
  avgDailySales: number
  daysLeft: number
  suggestedReorderQty: number
}

interface DeadStockItem {
  productId: string
  name: string
  sku: string
  currentStock: number
  daysSinceLastSale: number | null
}

interface FastMovingItem {
  productId: string
  name: string
  sku: string
  currentStock: number
  avgDailySales: number
}

interface DashboardData {
  summary: DashboardSummary
  lowStockItems: LowStockItem[]
  reorderSuggestions: ReorderSuggestion[]
  deadStockItems: DeadStockItem[]
  fastMovingItems: FastMovingItem[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

// ─── Create Store Modal ───────────────────────────────────────────────────────

function CreateStoreModal({
  onCreated,
  onClose,
  isFirstStore,
}: {
  onCreated: (store: StoreData) => void
  onClose?: () => void
  isFirstStore: boolean
}) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create store')
      onCreated(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-600">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isFirstStore ? 'Create Your Store' : 'New Store'}
            </h2>
            <p className="text-sm text-slate-500">
              {isFirstStore ? 'Set up your inventory store to get started' : 'Add another store to manage'}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Warehouse, Retail Store"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-2">
            {!isFirstStore && onClose && (
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" />Create Store</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: 'green' | 'amber' | 'red' | 'indigo'
}) {
  const colors = { green: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', red: 'bg-red-50 text-red-600', indigo: 'bg-indigo-50 text-indigo-600' }
  const color = colors[accent ?? 'indigo']
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}><Icon className="h-5 w-5" /></div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Assistant Chat ───────────────────────────────────────────────────────────

function AssistantChat({ storeId }: { storeId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome', role: 'assistant',
    content: 'Hi! I can answer questions about your inventory.\n\nTry: "What needs to be reordered?", "Which products are at risk?", or "Give me a summary."',
  }])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    const q = question.trim()
    if (!q || loading) return
    setQuestion('')
    setMessages((prev) => [...prev,
      { id: Date.now().toString(), role: 'user', content: q },
      { id: 'loading', role: 'assistant', content: '', loading: true },
    ])
    setLoading(true)
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, question: q }),
      })
      const data = await res.json()
      const answer = res.ok ? (data.answer ?? JSON.stringify(data)) : (data.error ?? 'Something went wrong.')
      setMessages((prev) => prev.filter((m) => m.id !== 'loading').concat({ id: Date.now().toString(), role: 'assistant', content: answer }))
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== 'loading').concat({ id: Date.now().toString(), role: 'assistant', content: 'Network error. Please try again.' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[560px]">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60 rounded-t-xl">
        <div className="p-1.5 rounded-lg bg-indigo-600"><Sparkles className="h-4 w-4 text-white" /></div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Inventory Assistant</p>
          <p className="text-xs text-slate-400">Powered by your real sales data</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[84%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
              {msg.loading ? (
                <span className="flex gap-1 items-center py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                </span>
              ) : msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text" value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about inventory, reorders, risk…"
            className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button onClick={send} disabled={loading || !question.trim()} className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {["What needs reordering?", "Show at-risk items", "Fast-moving products", "Give me a summary"].map((q) => (
            <button key={q} onClick={() => setQuestion(q)} className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loadingStores, setLoadingStores] = useState(true)
  const [loadingDash, setLoadingDash] = useState(false)
  const [error, setError] = useState('')
  const [showCreateStore, setShowCreateStore] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'reorder' | 'dead' | 'fast'>('overview')

  useEffect(() => {
    fetch('/api/stores')
      .then((r) => r.json())
      .then((data: StoreData[]) => {
        if (Array.isArray(data)) {
          setStores(data)
          if (data.length > 0) setSelectedStoreId(data[0].id)
        }
      })
      .catch(() => setError('Failed to load stores. Make sure you are logged in.'))
      .finally(() => setLoadingStores(false))
  }, [])

  const loadDashboard = useCallback(async (storeId: string) => {
    setLoadingDash(true)
    setError('')
    try {
      const res = await fetch(`/api/dashboard?storeId=${storeId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load dashboard')
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoadingDash(false)
    }
  }, [])

  useEffect(() => { if (selectedStoreId) loadDashboard(selectedStoreId) }, [selectedStoreId, loadDashboard])

  const handleStoreCreated = (store: StoreData) => {
    setStores((prev) => [...prev, store])
    setSelectedStoreId(store.id)
    setShowCreateStore(false)
  }

  const selectedStore = stores.find((s) => s.id === selectedStoreId)
  const summary = dashboardData?.summary
  const tabs = [
    { id: 'overview' as const, label: 'Low Stock', count: dashboardData?.lowStockItems.length },
    { id: 'reorder' as const, label: 'Reorder Now', count: dashboardData?.reorderSuggestions.length },
    { id: 'dead' as const, label: 'Dead Stock', count: dashboardData?.deadStockItems.length },
    { id: 'fast' as const, label: 'Fast Moving', count: dashboardData?.fastMovingItems.length },
  ]

  if (loadingStores) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center"><RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-3" /><p className="text-slate-600">Loading…</p></div>
      </div>
    )
  }

  if (stores.length === 0 && !loadingStores) {
    return <CreateStoreModal onCreated={handleStoreCreated} isFirstStore={true} />
  }

  return (
    <div className="space-y-6 min-h-screen bg-slate-50 p-6">
      {showCreateStore && <CreateStoreModal onCreated={handleStoreCreated} onClose={() => setShowCreateStore(false)} isFirstStore={false} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Live inventory intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={selectedStoreId ?? ''} onChange={(e) => setSelectedStoreId(e.target.value)} className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
              {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => setShowCreateStore(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors">
            <Plus className="h-3.5 w-3.5" />New Store
          </button>
          <button onClick={() => selectedStoreId && loadDashboard(selectedStoreId)} disabled={loadingDash} className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50" title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loadingDash ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={loadingDash ? '—' : (summary?.totalProducts ?? 0)} sub="in this store" accent="indigo" />
        <StatCard icon={BarChart3} label="Total Stock" value={loadingDash ? '—' : (summary?.totalStock ?? 0)} sub="units on hand" accent="green" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={loadingDash ? '—' : (summary?.lowStockCount ?? 0)} sub="need attention" accent="amber" />
        <StatCard icon={TrendingDown} label="Dead Stock" value={loadingDash ? '—' : (summary?.deadStockCount ?? 0)} sub="no recent sales" accent="red" />
      </div>

      {/* Tables + Assistant */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Inventory tables */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 flex overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {loadingDash && (
            <div className="p-6 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}</div>
          )}

          {!loadingDash && summary?.totalProducts === 0 && (
            <div className="p-6">
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
                <div className="inline-flex p-3 rounded-full bg-indigo-50 mb-4"><Package className="h-6 w-6 text-indigo-500" /></div>
                <h3 className="font-semibold text-slate-900 mb-1">No products yet in {selectedStore?.name}</h3>
                <p className="text-sm text-slate-500 mb-4">Add products via the API to start tracking inventory intelligence.</p>
              </div>
            </div>
          )}

          {/* Low Stock */}
          {!loadingDash && activeTab === 'overview' && (dashboardData?.lowStockItems?.length ?? 0) > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100"><tr>{['Product','SKU','Stock','Reorder At','Days Left','Reason'].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboardData!.lowStockItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{item.name}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{item.sku}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-amber-600">{item.currentStock}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.reorderPoint}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.daysLeft === null ? '—' : item.daysLeft === 0 ? <span className="text-red-600 font-semibold">Out</span> : `${item.daysLeft}d`}</td>
                      <td className="px-5 py-3.5"><span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{item.reason}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingDash && activeTab === 'overview' && (dashboardData?.lowStockItems?.length ?? 0) === 0 && summary?.totalProducts !== 0 && (
            <div className="p-10 text-center"><AlertTriangle className="h-8 w-8 text-emerald-400 mx-auto mb-3" /><p className="font-medium text-slate-700">All stock levels are healthy</p></div>
          )}

          {/* Reorder */}
          {!loadingDash && activeTab === 'reorder' && (dashboardData?.reorderSuggestions?.length ?? 0) > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100"><tr>{['Product','SKU','Stock','Avg Daily','Days Left','Order Qty'].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboardData!.reorderSuggestions.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{item.name}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{item.sku}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.currentStock}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.avgDailySales}/day</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-amber-600">{item.daysLeft}d</td>
                      <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full"><ArrowRight className="h-3 w-3" />{item.suggestedReorderQty} units</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingDash && activeTab === 'reorder' && (dashboardData?.reorderSuggestions?.length ?? 0) === 0 && summary?.totalProducts !== 0 && (
            <div className="p-10 text-center"><TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-3" /><p className="font-medium text-slate-700">No reorders needed right now</p></div>
          )}

          {/* Dead Stock */}
          {!loadingDash && activeTab === 'dead' && (dashboardData?.deadStockItems?.length ?? 0) > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100"><tr>{['Product','SKU','Stock','Days Since Sale'].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboardData!.deadStockItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{item.name}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{item.sku}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.currentStock}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-600">{item.daysSinceLastSale === null ? 'Never sold' : `${item.daysSinceLastSale}d`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingDash && activeTab === 'dead' && (dashboardData?.deadStockItems?.length ?? 0) === 0 && summary?.totalProducts !== 0 && (
            <div className="p-10 text-center"><Zap className="h-8 w-8 text-amber-400 mx-auto mb-3" /><p className="font-medium text-slate-700">No dead stock detected</p></div>
          )}

          {/* Fast Moving */}
          {!loadingDash && activeTab === 'fast' && (dashboardData?.fastMovingItems?.length ?? 0) > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100"><tr>{['Product','SKU','Stock','Avg Daily Sales'].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {dashboardData!.fastMovingItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{item.name}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{item.sku}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{item.currentStock}</td>
                      <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full"><TrendingUp className="h-3 w-3" />{item.avgDailySales}/day</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loadingDash && activeTab === 'fast' && (dashboardData?.fastMovingItems?.length ?? 0) === 0 && summary?.totalProducts !== 0 && (
            <div className="p-10 text-center"><TrendingUp className="h-8 w-8 text-slate-300 mx-auto mb-3" /><p className="font-medium text-slate-700">No fast-moving items yet — record sales to see velocity data</p></div>
          )}
        </div>

        {/* AI Assistant */}
        <div className="xl:col-span-1">
          {selectedStoreId && <AssistantChat storeId={selectedStoreId} />}
        </div>
      </div>
    </div>
  )
}

