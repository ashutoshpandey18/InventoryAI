'use client'

import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react'
import { dashboardStats, dashboardChartData, dashboardRecentItems } from '@/lib/mock-data'

const iconMap = {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Inventory intelligence overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap]
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-md bg-slate-50">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    stat.trend === 'up'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reorder Alerts Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Reorder Alerts</h2>
          <p className="text-sm text-slate-500">Items requiring attention</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  SKU
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Product Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Stock
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  Days to Runout
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardRecentItems.map((item) => (
                <tr
                  key={item.sku}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.stock} units</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'critical'
                          ? 'bg-slate-200 text-slate-800'
                          : item.status === 'low'
                          ? 'bg-slate-100 text-slate-700'
                          : item.status === 'moderate'
                          ? 'bg-slate-50 text-slate-600'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.days} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Forecast Accuracy Trend</h2>
          <p className="text-sm text-slate-500">Last 6 months performance</p>
        </div>

        <div className="flex items-end justify-between h-48 gap-4">
          {dashboardChartData.map((item, i) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-indigo-600 rounded-t"
                style={{
                  height: `${item.value}%`,
                }}
              />
              <span className="text-xs text-slate-600 font-medium">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
