'use client'

import { Button } from './ui/Button'
import { heroPreviewItems } from '@/lib/mock-data'

export function Hero() {
  return (
    <section className="relative overflow-visible">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-slate-900">
              Know what to reorder{' '}
              <span className="text-indigo-600">before you run out.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Automated inventory tracking predicts stockouts and calculates reorder quantities using your sales data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="secondary" size="lg">
                See How It Works
              </Button>
            </div>

            {/* Trust / proof strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <span className="text-sm text-slate-400">Used by early retail stores</span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-400">Voice-first inventory workflows</span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-400">Predictive reorder engine</span>
            </div>
          </div>

          {/* Right — Product Preview Panel */}
          <div className="relative">
            <div className="transform rotate-0 scale-100 lg:rotate-[-2deg] lg:scale-[1.02] rounded-2xl border border-slate-100 bg-white shadow-[0_8px_48px_-8px_rgba(0,0,0,0.08),0_2px_12px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-medium text-slate-400 ml-2">InventoryAI — Dashboard</span>
              </div>

              <div className="p-6 space-y-5">
                {/* Metric chips row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-400 mb-1">Total SKUs</div>
                    <div className="text-lg font-semibold text-slate-900">1,284</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-xs text-slate-400 mb-1">At Risk</div>
                    <div className="text-lg font-semibold text-red-600">12</div>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-3">
                    <div className="text-xs text-slate-400 mb-1">Fill Rate</div>
                    <div className="text-lg font-semibold text-indigo-600">97.3%</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Mini table — reorder alerts */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reorder Alerts</span>
                    <span className="text-xs text-slate-400">{heroPreviewItems.length} items</span>
                  </div>
                  <div className="space-y-2">
                    {heroPreviewItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50/70 border border-slate-100"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {item.stock} units left · {item.runout}d until stockout
                          </div>
                        </div>
                        <span className="ml-4 text-sm font-semibold text-indigo-600 shrink-0">
                          +{item.qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Progress bars — forecast accuracy */}
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Forecast Accuracy</div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Almond Milk</span>
                        <span className="text-slate-700 font-medium">94%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[94%] bg-indigo-600 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Wheat Bread</span>
                        <span className="text-slate-700 font-medium">89%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[89%] bg-indigo-500 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Greek Yogurt</span>
                        <span className="text-slate-700 font-medium">91%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[91%] bg-indigo-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer label */}
                <div className="text-xs text-slate-400 text-center pt-1">
                  Based on 90-day sales velocity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
