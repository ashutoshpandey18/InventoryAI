'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, RefreshCw, TrendingUp, DollarSign, ShoppingCart, BarChart2 } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface StoreData { id: string; name: string }
interface SaleRecord {
  id: string; quantity: number; totalAmount: number; soldAt: string
  product: { id: string; name: string }
}

interface DayStat { date: string; revenue: number; units: number }
interface ProductStat { name: string; units: number; revenue: number }

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stores').then(r => r.json()).then((data: StoreData[]) => {
      if (Array.isArray(data) && data.length) { setStores(data); setStoreId(data[0].id) }
      else setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const loadSales = useCallback(async (sid: string) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/sales?storeId=${sid}`)
      const d = await r.json()
      setSales(Array.isArray(d) ? d : [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { if (storeId) loadSales(storeId) }, [storeId, loadSales])

  // Aggregate: last 14 days revenue + units
  const dailyStats: DayStat[] = (() => {
    const map: Record<string, DayStat> = {}
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      map[key] = { date: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: 0, units: 0 }
    }
    sales.forEach(s => {
      const key = new Date(s.soldAt).toISOString().slice(0, 10)
      if (map[key]) { map[key].revenue += s.totalAmount; map[key].units += s.quantity }
    })
    return Object.values(map)
  })()

  // Top 10 products by units sold
  const productStats: ProductStat[] = (() => {
    const map: Record<string, ProductStat> = {}
    sales.forEach(s => {
      const name = s.product?.name ?? 'Unknown'
      if (!map[name]) map[name] = { name, units: 0, revenue: 0 }
      map[name].units += s.quantity; map[name].revenue += s.totalAmount
    })
    return Object.values(map).sort((a, b) => b.units - a.units).slice(0, 10)
  })()

  const totalRevenue = sales.reduce((s, r) => s + r.totalAmount, 0)
  const totalUnits = sales.reduce((s, r) => s + r.quantity, 0)
  const todayRevenue = dailyStats[dailyStats.length - 1]?.revenue ?? 0
  const yesterdayRevenue = dailyStats[dailyStats.length - 2]?.revenue ?? 0
  const revenueChange = yesterdayRevenue ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : null

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-5">
      {/* Store Selector */}
      {stores.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Store:</span>
          <div className="relative">
            <select value={storeId ?? ''} onChange={e => setStoreId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} color="bg-emerald-500" />
        <StatCard label="Total Sales" value={`${sales.length}`} icon={ShoppingCart} color="bg-indigo-500" />
        <StatCard label="Units Sold" value={`${totalUnits}`} icon={BarChart2} color="bg-blue-500" />
        <StatCard label="Today's Revenue" value={`$${todayRevenue.toFixed(2)}`}
          sub={revenueChange ? `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}% vs yesterday` : undefined}
          icon={TrendingUp} color="bg-violet-500" />
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading analytics…</p>
        </div>
      )}

      {!loading && sales.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-14 text-center">
          <BarChart2 className="h-8 w-8 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-800">No sales data yet</p>
          <p className="text-sm text-slate-400 mt-1">Record your first sale to see analytics here</p>
        </div>
      )}

      {!loading && sales.length > 0 && (
        <>
          {/* Revenue Over Time */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-5">Revenue & Units — Last 14 Days</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyStats} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#6366f1" strokeWidth={2} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="units" name="Units Sold" stroke="#10b981" strokeWidth={2} fill="url(#colorUnits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          {productStats.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-5">Top Products by Units Sold</h2>
              <ResponsiveContainer width="100%" height={Math.max(220, productStats.length * 40)}>
                <BarChart data={productStats} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#475569' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="units" name="Units Sold" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Products Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Product Revenue Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Rank', 'Product', 'Units Sold', 'Total Revenue', 'Avg/Sale'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {productStats.map((p, i) => (
                    <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">#{i + 1}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{p.name}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{p.units}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">${p.revenue.toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">${(p.revenue / p.units).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
