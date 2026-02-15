'use client'

import { Button } from './ui/Button'
import { heroPreviewItems } from '@/lib/mock-data'

export function Hero() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
            Know what to reorder <span className="text-indigo-600">before you run out.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
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
        </div>

        <div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-1">
            <div className="rounded-lg bg-slate-50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Reorder Alert
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{heroPreviewItems.length} Items</div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-sm bg-white/30" />
                </div>
              </div>

              <div className="space-y-2">
                {heroPreviewItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-md bg-white border border-slate-200"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        Stock: {item.stock} units • Runout: {item.runout}d
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600">
                      +{item.qty}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 text-center">
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
