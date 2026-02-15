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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Your Inventory Dashboard
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real-time predictions and automated reorder suggestions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Low Stock Risk List */}
          <div
            className="bg-white rounded-lg border border-slate-200 shadow-sm transition-shadow duration-200"
          >
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-md bg-slate-100">
                <AlertTriangle className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Low Stock Risk</h3>
                <p className="text-sm text-slate-500">Items requiring immediate attention</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {lowStockItems.map((item, i) => (
                  <div
                    key={item.sku}
                    className="flex items-center justify-between p-3 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{item.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.riskLevel === 'critical'
                              ? 'bg-slate-200 text-slate-800'
                              : item.riskLevel === 'high'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.stock} units • {item.runoutDays}d runout • {item.velocity}/day velocity
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reorder Suggestions */}
          <div
            className="bg-white rounded-lg border border-slate-200 shadow-sm transition-shadow duration-200"
          >
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-md bg-indigo-50">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Reorder Suggestions</h3>
                <p className="text-sm text-slate-500">Calculated reorder quantities</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {reorderSuggestions.map((item, i) => (
                  <div
                    key={item.sku}
                    className="p-4 rounded-md border border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-1 flex-1">
                        <div className="text-sm font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">Current: {item.currentStock} units</div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          item.priority === 'urgent'
                            ? 'bg-slate-200 text-slate-800'
                            : item.priority === 'high'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="text-sm">
                        <span className="text-slate-500">Order: </span>
                        <span className="font-semibold text-indigo-600">+{item.suggestedQty} units</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {formatCurrency(item.estimatedCost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Velocity Chart */}
          <div
            className="bg-white rounded-lg border border-slate-200 shadow-sm transition-shadow duration-200"
          >
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-md bg-indigo-50">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Sales Velocity</h3>
                <p className="text-sm text-slate-500">6-month trend vs forecast</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {velocityData.map((point, i) => {
                  const accuracy = ((point.sales / point.forecast) * 100).toFixed(1)
                  const isAbove = point.sales >= point.forecast
                  return (
                    <div
                      key={point.month}
                      className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 transition-colors duration-200"
                    >
                      <div className="text-xs font-medium text-slate-600 w-8">{point.month}</div>
                      <div className="flex-1">
                        <div className="flex gap-1 items-center">
                          <div className="flex-1 h-8 bg-slate-100 rounded-md overflow-hidden relative">
                            <div
                              className="h-full bg-indigo-600 rounded-md transition-all duration-500"
                              style={{
                                width: `${(point.sales / Math.max(...velocityData.map(d => d.sales))) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="w-16 text-right">
                            <div className="text-sm font-semibold text-slate-900">{point.sales}</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          isAbove
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-slate-100 text-slate-700'
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

          {/* AI Assistant Preview */}
          <div
            className="bg-white rounded-lg border border-slate-200 shadow-sm transition-shadow duration-200"
          >
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <div className="p-2 rounded-md bg-indigo-50">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recommendations</h3>
                <p className="text-sm text-slate-500">Automated insights</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {aiInsights.map((insight, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-md border border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 p-1.5 rounded ${
                          insight.type === 'warning'
                            ? 'bg-slate-200'
                            : insight.type === 'recommendation'
                            ? 'bg-indigo-100'
                            : 'bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            insight.type === 'warning'
                              ? 'bg-slate-600'
                              : insight.type === 'recommendation'
                              ? 'bg-indigo-600'
                              : 'bg-slate-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-slate-700 leading-relaxed">{insight.message}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                              style={{ width: `${insight.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            {insight.confidence}% confident
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
