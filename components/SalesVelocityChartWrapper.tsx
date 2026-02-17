'use client'

import dynamic from 'next/dynamic'
import { velocityData } from '@/lib/mock-data'

const SalesVelocityChart = dynamic(
  () => import('@/components/SalesVelocityChart').then((mod) => mod.SalesVelocityChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-black/[0.02] p-6">
        <div className="mb-6">
          <div className="h-5 w-40 bg-slate-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-28 bg-slate-50 rounded animate-pulse" />
        </div>
        <div className="w-full h-[300px] bg-slate-50 rounded-lg animate-pulse" />
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
          <div className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
        </div>
      </div>
    ),
  }
)

export function SalesVelocityChartWrapper() {
  return <SalesVelocityChart data={velocityData} />
}
