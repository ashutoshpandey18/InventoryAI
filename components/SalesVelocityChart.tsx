'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * Data point for the sales velocity chart
 * @interface ChartDataPoint
 * @property {string} month - Month label (e.g., "Jan", "Feb")
 * @property {number} sales - Actual sales value for the month
 * @property {number} forecast - Forecasted sales value for the month
 */
interface ChartDataPoint {
  month: string
  sales: number
  forecast: number
}

/**
 * Props for SalesVelocityChart component
 * @interface SalesVelocityChartProps
 * @property {ChartDataPoint[]} data - Array of monthly sales and forecast data
 */
interface SalesVelocityChartProps {
  data: ChartDataPoint[]
}

/**
 * SalesVelocityChart Component
 * 
 * Renders a dual-area chart displaying actual sales vs forecasted sales over time.
 * Features smooth animations, responsive design, and custom tooltips.
 * 
 * Visual Design:
 * - Actual sales: Solid indigo line with gradient fill
 * - Forecast: Dashed gray line with subtle fill
 * - Auto-formatted Y-axis with K suffix for thousands
 * - Interactive tooltips on hover
 * 
 * @component
 * @param {SalesVelocityChartProps} props - Component props
 * 
 * @example
 * ```tsx
 * const salesData = [
 *   { month: 'Jan', sales: 4000, forecast: 3800 },
 *   { month: 'Feb', sales: 4500, forecast: 4300 },
 *   { month: 'Mar', sales: 5200, forecast: 4900 }
 * ];
 * 
 * <SalesVelocityChart data={salesData} />
 * ```
 * 
 * @returns {JSX.Element} Rendered chart with sales velocity visualization
 */
export function SalesVelocityChart({ data }: SalesVelocityChartProps) {
  return (
    <div 
      className="bg-white rounded-xl border border-slate-100/80 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.05),0_1px_6px_-2px_rgba(0,0,0,0.03)] p-6"
      role="region"
      aria-label="Sales velocity chart"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Sales Velocity</h3>
        <p className="text-sm text-slate-400">6-month trend analysis</p>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(79, 70, 229)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="rgb(79, 70, 229)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(148, 163, 184)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="rgb(148, 163, 184)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              dx={-10}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '12px',
              }}
              labelStyle={{
                color: '#0f172a',
                fontWeight: 600,
                marginBottom: '4px',
              }}
              itemStyle={{
                color: '#475569',
                fontSize: '13px',
                padding: '2px 0',
              }}
              cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              animationDuration={200}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#forecastGradient)"
              strokeDasharray="5 5"
              animationDuration={200}
              animationEasing="ease-out"
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#4f46e5"
              strokeWidth={3}
              fill="url(#salesGradient)"
              animationDuration={200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600" />
          <span className="text-sm text-slate-500">Actual Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-slate-400" style={{ width: '16px' }} />
          <span className="text-sm text-slate-500">Forecast</span>
        </div>
      </div>
    </div>
  )
}
