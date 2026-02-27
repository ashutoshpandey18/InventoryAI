'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Package, RefreshCw, X,
  ChevronDown, AlertTriangle, CheckCircle, Layers, Search
} from 'lucide-react'

interface StoreData { id: string; name: string }
interface InventoryData { quantity: number; reorderPoint: number }
interface Product {
  id: string; name: string; sku: string; unit: string
  storeId: string; createdAt: string
  inventory: InventoryData | null
}

// ─── Toast ────────────────────────────────────────────────────
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

// ─── Add / Edit Product Modal ──────────────────────────────────
function ProductModal({ storeId, product, onDone, onClose }: {
  storeId: string; product?: Product; onDone: (p: Product) => void; onClose: () => void
}) {
  const isEdit = !!product
  const [form, setForm] = useState({
    name: product?.name ?? '', sku: product?.sku ?? '',
    unit: product?.unit ?? 'unit',
    initialStock: product?.inventory?.quantity ?? 0,
    reorderPoint: product?.inventory?.reorderPoint ?? 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch(isEdit ? `/api/products/${product!.id}` : '/api/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { name: form.name, sku: form.sku, unit: form.unit } : { ...form, storeId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      onDone(data)
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"><X className="h-4 w-4 text-slate-500" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {[
            { key: 'name', label: 'Product Name *', placeholder: 'e.g. Wireless Headphones' },
            { key: 'sku', label: 'SKU (optional)', placeholder: 'Auto-generated if empty' },
            { key: 'unit', label: 'Unit', placeholder: 'e.g. unit, kg, box' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              <input type="text" value={(form as any)[key]} placeholder={placeholder}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={key === 'name'} />
            </div>
          ))}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              {[{ key: 'initialStock', label: 'Initial Stock' }, { key: 'reorderPoint', label: 'Reorder Point' }].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input type="number" min="0" value={(form as any)[key]}
                    onChange={(e) => setForm(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Adjust Stock Modal ────────────────────────────────────────
function AdjustStockModal({ product, onDone, onClose }: { product: Product; onDone: (p: Product) => void; onClose: () => void }) {
  const [qty, setQty] = useState(product.inventory?.quantity ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch(`/api/products/${product.id}/stock`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onDone({ ...product, inventory: data })
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Adjust Stock</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="h-4 w-4 text-slate-500" /></button>
        </div>
        <p className="text-sm text-slate-500 mb-4">Set current stock for <span className="font-semibold text-slate-700">{product.name}</span></p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Quantity</label>
            <input type="number" min="0" value={qty} onChange={(e) => setQty(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ──────────────────────────────────────
function DeleteModal({ product, onDone, onClose }: { product: Product; onDone: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const confirm = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      onDone()
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Delete Product</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X className="h-4 w-4 text-slate-500" /></button>
        </div>
        <p className="text-sm text-slate-600 mb-5">Delete <span className="font-semibold text-slate-800">{product.name}</span>? This also removes all linked sales history and cannot be undone.</p>
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={confirm} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4" />Delete</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────
export default function ProductsPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | 'stock' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')

  const notify = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type })

  useEffect(() => {
    fetch('/api/stores').then(r => r.json()).then((data: StoreData[]) => {
      if (Array.isArray(data) && data.length) { setStores(data); setStoreId(data[0].id) }
      else setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const loadProducts = useCallback(async (sid: string) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/products?storeId=${sid}`)
      const d = await r.json()
      setProducts(Array.isArray(d) ? d : [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { if (storeId) loadProducts(storeId) }, [storeId, loadProducts])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const getStatus = (p: Product) => {
    const q = p.inventory?.quantity ?? 0; const r = p.inventory?.reorderPoint ?? 0
    if (q === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (q <= r) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' }
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700' }
  }

  const stats = {
    total: products.length,
    low: products.filter(p => (p.inventory?.quantity ?? 0) <= (p.inventory?.reorderPoint ?? 0) && (p.inventory?.quantity ?? 0) > 0).length,
    out: products.filter(p => (p.inventory?.quantity ?? 0) === 0).length,
    ok: products.filter(p => (p.inventory?.quantity ?? 0) > (p.inventory?.reorderPoint ?? 0)).length,
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal === 'add' && storeId && <ProductModal storeId={storeId} onDone={(p) => { setProducts(prev => [p, ...prev]); setModal(null); notify('Product added!') }} onClose={() => setModal(null)} />}
      {modal === 'edit' && selected && storeId && <ProductModal storeId={storeId} product={selected} onDone={(p) => { setProducts(prev => prev.map(x => x.id === p.id ? { ...x, ...p } : x)); setModal(null); notify('Product updated!') }} onClose={() => setModal(null)} />}
      {modal === 'stock' && selected && <AdjustStockModal product={selected} onDone={(p) => { setProducts(prev => prev.map(x => x.id === p.id ? p : x)); setModal(null); notify('Stock updated!') }} onClose={() => setModal(null)} />}
      {modal === 'delete' && selected && <DeleteModal product={selected} onDone={() => { setProducts(prev => prev.filter(x => x.id !== selected.id)); setModal(null); notify('Product deleted!') }} onClose={() => setModal(null)} />}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'In Stock', value: stats.ok, color: 'text-emerald-600', bg: 'bg-white' },
          { label: 'Low Stock', value: stats.low, color: 'text-amber-600', bg: 'bg-white' },
          { label: 'Out of Stock', value: stats.out, color: 'text-red-600', bg: 'bg-white' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-slate-200 p-4 shadow-sm`}>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {stores.length > 1 && (
            <div className="relative">
              <select value={storeId ?? ''} onChange={e => setStoreId(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU…"
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52" />
          </div>
        </div>
        <button onClick={() => setModal('add')} disabled={!storeId}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" />Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center"><RefreshCw className="h-6 w-6 text-indigo-400 animate-spin mx-auto mb-2" /><p className="text-sm text-slate-500">Loading products…</p></div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <div className="inline-flex p-3 rounded-full bg-indigo-50 mb-4"><Package className="h-6 w-6 text-indigo-400" /></div>
            <p className="font-semibold text-slate-900">{search ? 'No matches found' : 'No products yet'}</p>
            {!search && <p className="text-sm text-slate-400 mt-1 mb-5">Add your first product to start tracking inventory</p>}
            {!search && <button onClick={() => setModal('add')} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"><Plus className="h-4 w-4" />Add First Product</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Product', 'SKU', 'Unit', 'Stock', 'Reorder At', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => {
                  const status = getStatus(p)
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{p.name}</td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-400">{p.sku || '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 capitalize">{p.unit}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-800">{p.inventory?.quantity ?? '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{p.inventory?.reorderPoint ?? '—'}</td>
                      <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>{status.label}</span></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setSelected(p); setModal('stock') }} title="Adjust stock"
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"><Layers className="h-4 w-4" /></button>
                          <button onClick={() => { setSelected(p); setModal('edit') }} title="Edit"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => { setSelected(p); setModal('delete') }} title="Delete"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
