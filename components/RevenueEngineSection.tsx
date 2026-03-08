'use client'

import { useEffect, useRef, useState } from 'react'

export function RevenueEngineSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show dashboard as soon as section enters viewport; keep shown once revealed
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-14 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left Side - Dashboard Frame */}
          <div className="relative">
            {/* Gradient Frame Container */}
            <div
              className="relative rounded-3xl overflow-hidden flex flex-col justify-start p-5 sm:p-7 lg:pt-10 lg:px-10 lg:pb-10 min-h-[380px] lg:min-h-[520px]"
              style={{
                background: 'linear-gradient(135deg, #7AA2D6 0%, #8B6FB3 100%)',
              }}
            >
              {/* Animated Dashboard - Slides Up from Bottom */}
              <div
                className="w-full self-start"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateY(0)'
                    : 'translateY(60px)',
                  pointerEvents: 'none',
                  visibility: isVisible ? 'visible' : 'hidden',
                  willChange: 'transform, opacity',
                  transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-slate-900/5">
                  <div className="space-y-6">
                    {/* Dashboard Content */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Inventory Overview</h3>
                      <p className="text-sm text-slate-600 mt-1">Real-time inventory insights</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">Total Products</div>
                        <div className="text-xl font-bold text-slate-900">248</div>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-1">In Stock</div>
                        <div className="text-xl font-bold text-emerald-900">211</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Low Stock</div>
                        <div className="text-xl font-bold text-blue-900">18</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">Dead Stock</div>
                        <div className="text-xl font-bold text-amber-900">7</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-700">Inventory Health</span>
                        <span className="text-slate-900">85% Healthy</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: '85%' }} />
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: '7%' }} />
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '3%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Low Stock Items</div>
                      <div className="space-y-2">
                        {[
                          { name: 'Milk', amount: '12 units', status: 'Reorder', statusColor: 'emerald' },
                          { name: 'Bread', amount: '8 units', status: 'Reorder', statusColor: 'emerald' },
                          { name: 'Butter', amount: '15 units', status: 'Low', statusColor: 'blue' },
                          { name: 'Rice', amount: '6 units', status: 'Critical', statusColor: 'amber' },
                        ].map((partner, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                {partner.name.charAt(0)}
                              </div>
                              <span className="text-sm font-semibold text-slate-900">{partner.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-900">{partner.amount}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                partner.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                                partner.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {partner.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="text-xs font-bold tracking-widest uppercase text-slate-500">
              Smart Reordering
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Turn Inventory Data Into Reorder Decisions
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Track stock levels, monitor product velocity, and automatically identify when items need to be reordered.
              InventoryAI analyzes sales patterns and current stock to suggest the right quantities at the right time.
            </p>

            {/* Highlight Metric */}
            <div className="inline-flex items-center px-5 py-3 rounded-full bg-slate-100 border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                <span className="text-slate-900 font-bold">30%</span> reduction in stockouts and overstock situations
              </span>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Reorder Suggestions
                </button>
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Stock Alerts
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Sales Velocity Tracking
                </button>
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Inventory Insights
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
