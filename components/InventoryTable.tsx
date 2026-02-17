'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { inventoryTableData, type InventoryItem } from '@/lib/mock-data'
import { formatDateTime } from '@/lib/utils'

type SortField = 'product' | 'stockLeft' | 'daysLeft' | 'suggestedReorder'
type SortDirection = 'asc' | 'desc'

export function InventoryTable() {
  const [sortField, setSortField] = useState<SortField>('daysLeft')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...inventoryTableData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const SortButton = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sortField === field
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 group"
      >
        <span>{label}</span>
        <span className="transition-opacity duration-200">
          {isActive ? (
            sortDirection === 'asc' ? (
              <ChevronUp className="h-4 w-4 text-indigo-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-indigo-600" />
            )
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-300" />
          )}
        </span>
      </button>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: 'bg-red-50 text-red-600 border-red-100',
      high: 'bg-amber-50 text-amber-600 border-amber-100',
      medium: 'bg-slate-50 text-slate-500 border-slate-100',
    }
    return styles[priority as keyof typeof styles] || styles.medium
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-black/[0.02] overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900 mb-1">
          Low Stock & Reorder Suggestions
        </h2>
        <p className="text-sm text-slate-400">
          Automated recommendations based on sales velocity and demand patterns
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/60 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wide">
                <SortButton field="product" label="Product" />
              </th>
              <th className="text-left px-6 py-3.5 text-xs uppercase tracking-wide">
                <SortButton field="stockLeft" label="Stock Left" />
              </th>
              <th className="text-left px-6 py-3.5 text-xs uppercase tracking-wide">
                <SortButton field="daysLeft" label="Days Left" />
              </th>
              <th className="text-left px-6 py-3.5 text-xs uppercase tracking-wide">
                <SortButton field="suggestedReorder" label="Suggested Reorder" />
              </th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wide font-medium text-slate-500">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((item, index) => (
              <tr
                key={item.id}
                className={`group transition-colors duration-150 hover:bg-slate-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-900">
                      {item.product}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200 ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 font-medium">
                    {item.stockLeft} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-semibold ${
                      item.daysLeft <= 3
                        ? 'text-slate-900'
                        : item.daysLeft <= 5
                        ? 'text-slate-700'
                        : 'text-slate-700'
                    }`}
                  >
                    {item.daysLeft} days
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-indigo-600">
                    +{item.suggestedReorder} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{item.reason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/40">
        <p className="text-xs text-slate-400">
          Last updated: {formatDateTime()}
        </p>
      </div>
    </div>
  )
}
