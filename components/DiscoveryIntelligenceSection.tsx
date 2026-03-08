'use client'

import { useState, useEffect, useRef } from 'react'

export function DiscoveryIntelligenceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show dashboard as soon as section enters viewport; keep shown once revealed
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.15,
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-14 lg:py-20 bg-white relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side — Gradient Dashboard Frame */}
          <div
            className="relative rounded-3xl overflow-hidden flex flex-col justify-start p-5 sm:p-7 lg:pt-10 lg:px-10 lg:pb-10 min-h-[380px] lg:min-h-[520px]"
            style={{
              background: 'linear-gradient(135deg, #C7E0C2, #B8D8C8)',
            }}
          >
            {/* Dashboard — Slides up from bottom */}
            <div
              className="w-full max-w-[540px] self-start"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                visibility: isVisible ? 'visible' : 'hidden',
                willChange: 'transform, opacity',
              }}
            >
              {/* Demand Intelligence Dashboard */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Demand Intelligence</h3>
                    <p className="text-xs text-slate-500 mt-0.5">AI-powered demand predictions</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700">Live</span>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-slate-500 mb-0.5">Signals Today</div>
                    <div className="text-lg font-bold text-slate-900">147</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-slate-500 mb-0.5">Stockouts Risk</div>
                    <div className="text-lg font-bold text-slate-900">8</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-slate-500 mb-0.5">Fast Moving</div>
                    <div className="text-lg font-bold text-slate-900">24</div>
                  </div>
                </div>

                {/* Table */}
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-3 text-xs font-medium text-slate-500 px-2">
                    <div className="col-span-3">Product</div>
                    <div className="col-span-2">Sales</div>
                    <div className="col-span-3">Demand</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Status</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-2">
                    {/* Row 1 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            M
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Milk</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-xs font-semibold text-slate-900">142</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '94%' }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-900">94%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Dairy
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">Hot</div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            B
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Bread</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-xs font-semibold text-slate-900">98</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '89%' }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-900">89%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          Bakery
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">Hot</div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-semibold">
                            B
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Butter</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-xs font-semibold text-slate-900">87</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '86%' }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-900">86%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Dairy
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">Warm</div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-semibold">
                            R
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Rice</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-xs font-semibold text-slate-900">76</div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '82%' }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-900">82%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Grain
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">Warm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side — Content */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="inline-block">
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                STOCK HEALTH
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Detect Slow-Moving and Dead Stock Early
            </h2>

            {/* Description */}
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl">
              Products that stop selling quietly drain working capital. InventoryAI continuously analyzes sales activity
              and highlights items that are becoming stagnant so you can act before inventory piles up.
            </p>

            {/* Highlight Metric */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-sm font-semibold text-slate-700">
                <span className="text-slate-900 font-bold">25%</span> reduction in dead stock write-offs
              </span>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Dead Stock Detection
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Sales Trend Monitoring
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Inventory Risk Signals
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Product Activity Tracking
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
