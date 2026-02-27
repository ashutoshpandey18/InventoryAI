'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, RefreshCw, ShoppingCart, DollarSign, Package, TrendingUp, AlertTriangle, CheckCircle, X } from 'lucide-react'

interface StoreData { id: string; name: string }
interface Product { id: string; name: string; sku: string; unit: string; inventory: { quantity: number } | null }
interface SaleRecord {
  id: string; quantity: number; totalAmount: number; soldAt: string
  product: { id: string; name: string; unit: string }
}

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

export default function SalesPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingSales, setLoadingSales] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [form, setForm] = useState({ productId: '', quantity: 1, totalAmount: '' })
  const [formError, setFormError] = useState('')

  const notify = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  useEffect(() => {
    fetch('/api/stores').then(r => r.json()).then((data: StoreData[]) => {
      if (Array.isArray(data) && data.length) { setStores(data); setStoreId(data[0].id) }
    }).catch(() => {})
  }, [])

  const loadData = useCallback(async (sid: string) => {
    setLoadingProducts(true); setLoadingSales(true); setForm(f => ({ ...f, productId: '' }))
    try {
      const [pr, sr] = await Promise.all([
        fetch(`/api/products?storeId=${sid}`).then(r => r.json()),
        fetch(`/api/sales?storeId=${sid}`).then(r => r.json()),
      ])
      setProducts(Array.isArray(pr) ? pr : [])
      setSales(Array.isArray(sr) ? sr : [])
    } finally { setLoadingProducts(false); setLoadingSales(false) }
  }, [])

  useEffect(() => { if (storeId) loadData(storeId) }, [storeId, loadData])

  const recordSale = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setSubmitting(true)
    try {
      if (!form.productId) throw new Error('Select a product')
      const body = { productId: form.productId, storeId, quantity: form.quantity, totalAmount: parseFloat(form.totalAmount) || 0 }
      const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to record sale')
      setSales(prev => [data, ...prev])
      setProducts(prev => prev.map(p => p.id === form.productId && p.inventory ? { ...p, inventory: { quantity: p.inventory.quantity - form.quantity } } : p))
      setForm({ productId: '', quantity: 1, totalAmount: '' })
      notify(`Sale recorded! Stock updated.`)
    } catch (err) { setFormError(err instanceof Error ? err.message : 'Failed') }
    finally { setSubmitting(false) }
  }

  const selectedProduct = products.find(p => p.id === form.productId)
  const totalRevenue = sales.reduce((s, r) => s + r.totalAmount, 0)
  const totalUnits = sales.reduce((s, r) => s + r.quantity, 0)
  const avgSaleValue = sales.length ? totalRevenue / sales.length : 0

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

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
        {[
          { label: 'Total Sales', value: sales.length, icon: ShoppingCart, color: 'text-indigo-600', iconBg: 'bg-indigo-50' },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', iconBg: 'bg-emerald-50' },
          { label: 'Units Sold', value: totalUnits, icon: Package, color: 'text-blue-600', iconBg: 'bg-blue-50' },
          { label: 'Avg Sale Value', value: `$${avgSaleValue.toFixed(2)}`, icon: TrendingUp, color: 'text-violet-600', iconBg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${s.iconBg}`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Record Sale Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Record a Sale</h2>
            <form onSubmit={recordSale} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product *</label>
                {loadingProducts ? (
                  <div className="flex items-center gap-2 text-sm text-slate-400 py-2"><RefreshCw className="h-3.5 w-3.5 animate-spin" />Loading…</div>
                ) : (
                  <div className="relative">
                    <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
                      className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                      <option value="">Select a product…</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (stock: {p.inventory?.quantity ?? 0})</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                )}
                {selectedProduct && <p className="text-xs text-slate-400 mt-1">Available: {selectedProduct.inventory?.quantity ?? 0} {selectedProduct.unit}s</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity *</label>
                <input type="number" min="1" max={selectedProduct?.inventory?.quantity ?? undefined} value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Amount ($)</label>
                <input type="number" min="0" step="0.01" value={form.totalAmount}
                  onChange={e => setForm(f => ({ ...f, totalAmount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              {formError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{formError}</p>}
              <button type="submit" disabled={submitting || !storeId}
                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                {submitting ? <><RefreshCw className="h-4 w-4 animate-spin" />Recording…</> : <><ShoppingCart className="h-4 w-4" />Record Sale</>}
              </button>
            </form>
          </div>
        </div>

        {/* Sales History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Sales History</h2>
              <span className="text-xs text-slate-400">{sales.length} record{sales.length !== 1 ? 's' : ''}</span>
            </div>
            {loadingSales ? (
              <div className="p-8 text-center"><RefreshCw className="h-5 w-5 text-indigo-400 animate-spin mx-auto mb-2" /><p className="text-sm text-slate-400">Loading…</p></div>
            ) : sales.length === 0 ? (
              <div className="p-10 text-center">
                <ShoppingCart className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">No sales recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">Use the form to record your first sale</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Product', 'Qty', 'Amount', 'Date'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sales.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{s.product?.name ?? '—'}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">{s.quantity} <span className="text-slate-400">{s.product?.unit ?? ''}</span></td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-emerald-600">${s.totalAmount?.toFixed(2) ?? '0.00'}</td>
                        <td className="px-5 py-3.5 text-xs text-slate-400">{new Date(s.soldAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
