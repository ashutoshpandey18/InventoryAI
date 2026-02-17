'use client'

import { AlertTriangle, TrendingUp, Sparkles, Package } from 'lucide-react'
import {
  lowStockItems,
  reorderSuggestions,
  velocityData,
  aiInsights,
} from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export function DashboardDemo() {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-sm font-medium text-indigo-600 mb-3">Dashboard</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 max-w-lg">
            Your inventory dashboard
          </h2>
          <p className="text-base text-slate-500 max-w-xl">
            Real-time predictions and automated reorder suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Low Stock Risk List */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-black/[0.02]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <AlertTriangle className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Low Stock Risk</h3>
                <p className="text-xs text-slate-400">Items requiring attention</p>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{item.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${
                            item.riskLevel === 'critical'
                              ? 'bg-red-50 text-red-600'
                              : item.riskLevel === 'high'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.stock} units · {item.runoutDays}d runout · {item.velocity}/day
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reorder Suggestions */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-black/[0.02]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Reorder Suggestions</h3>
                <p className="text-xs text-slate-400">Calculated quantities</p>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2.5">
                {reorderSuggestions.map((item) => (
                  <div
                    key={item.sku}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-0.5 flex-1">
                        <div className="text-sm font-medium text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-400">Current: {item.currentStock} units</div>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${
                          item.priority === 'urgent'
                            ? 'bg-red-50 text-red-600'
                            : item.priority === 'high'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="text-sm">
                        <span className="text-slate-400">Order: </span>
                        <span className="font-semibold text-indigo-600">+{item.suggestedQty} units</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {formatCurrency(item.estimatedCost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Velocity Chart */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-black/[0.02]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Sales Velocity</h3>
                <p className="text-xs text-slate-400">6-month trend vs forecast</p>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2.5">
                {velocityData.map((point) => {
                  const accuracy = ((point.sales / point.forecast) * 100).toFixed(1)
                  const isAbove = point.sales >= point.forecast
                  return (
                    <div
                      key={point.month}
                      className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      <div className="text-xs font-medium text-slate-400 w-8">{point.month}</div>
                      <div className="flex-1">
                        <div className="flex gap-1 items-center">
                          <div className="flex-1 h-7 bg-slate-50 rounded overflow-hidden relative border border-slate-100">
                            <div
                              className="h-full bg-indigo-600 rounded transition-all duration-500"
                              style={{
                                width: `${(point.sales / Math.max(...velocityData.map(d => d.sales))) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="w-14 text-right">
                            <div className="text-sm font-semibold text-slate-800">{point.sales}</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          isAbove
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-slate-50 text-slate-500'
                        }`}
                      >
                        {accuracy}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-black/[0.02]">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50">
                <Sparkles className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Recommendations</h3>
                <p className="text-xs text-slate-400">Automated insights</p>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2.5">
                {aiInsights.map((insight, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors duration-150"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                          insight.type === 'warning'
                            ? 'bg-amber-500'
                            : insight.type === 'recommendation'
                            ? 'bg-indigo-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-slate-600 leading-relaxed">{insight.message}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            {insight.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
