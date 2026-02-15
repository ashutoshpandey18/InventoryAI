'use client'

import dynamic from 'next/dynamic'
import { velocityData } from '@/lib/mock-data'

const SalesVelocityChart = dynamic(
  () => import('@/components/SalesVelocityChart').then((mod) => mod.SalesVelocityChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="mb-6">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="w-full h-[300px] bg-slate-50 rounded animate-pulse" />
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200">
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    ),
  }
)

export function SalesVelocityChartWrapper() {
  return <SalesVelocityChart data={velocityData} />
}
