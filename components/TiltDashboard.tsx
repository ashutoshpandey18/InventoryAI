'use client'

import { useEffect, useRef, useState } from 'react'
import { heroPreviewItems } from '@/lib/mock-data'

export function TiltDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(25) // Initial tilt angle

  useEffect(() => {
    const handleScroll = () => {
      if (!dashboardRef.current) return

      const rect = dashboardRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how much of the element is in view
      // When element is at bottom of viewport, progress = 0
      // When element is at top of viewport, progress = 1
      const elementTop = rect.top
      const elementHeight = rect.height
      
      // Start animation when element enters viewport
      if (elementTop < windowHeight && elementTop > -elementHeight) {
        // Calculate progress (0 to 1)
        const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight / 2)))
        
        // Interpolate rotation from 25deg to 0deg
        const newRotateX = 25 - (progress * 25)
        setRotateX(newRotateX)
      } else if (elementTop >= windowHeight) {
        // Element is below viewport - keep tilted
        setRotateX(25)
      } else {
        // Element is above viewport - keep flat
        setRotateX(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initialize on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14 text-center">
          <p className="text-sm font-medium text-indigo-600 mb-3">Dashboard Preview</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Your command center
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Real-time predictions, automated reorder suggestions, and intelligent insights—all in one place.
          </p>
        </div>

        {/* 3D Dashboard Container */}
        <div 
          ref={dashboardRef}
          className="relative dashboard-3d-container"
          style={{
            perspective: '2000px',
            perspectiveOrigin: 'center top',
          }}
        >
          <div
            className="dashboard-3d-content transition-transform duration-700 ease-out"
            style={{
              transform: `rotateX(${rotateX}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Dashboard Card with Mask */}
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_24px_96px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
              {/* Window chrome bar */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-sm font-medium text-slate-500 ml-3">InventryAI — Dashboard</span>
              </div>

              <div className="p-8 space-y-6">
                {/* Metric chips row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-2">Total SKUs</div>
                    <div className="text-3xl font-bold text-slate-900">1,284</div>
                    <div className="text-xs text-slate-400 mt-1">+12% from last month</div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 p-5 border border-red-100">
                    <div className="text-xs font-medium text-red-600 mb-2">At Risk</div>
                    <div className="text-3xl font-bold text-red-700">12</div>
                    <div className="text-xs text-red-500 mt-1">Needs attention</div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-5 border border-indigo-100">
                    <div className="text-xs font-medium text-indigo-600 mb-2">Fill Rate</div>
                    <div className="text-3xl font-bold text-indigo-700">97.3%</div>
                    <div className="text-xs text-indigo-500 mt-1">2% above target</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Reorder alerts table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">Reorder Alerts</h3>
                    <span className="text-xs text-slate-400 font-medium">{heroPreviewItems.length} items</span>
                  </div>
                  <div className="space-y-3">
                    {heroPreviewItems.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {item.stock} units left · {item.runout}d until stockout
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-3">
                          <span className="text-sm font-bold text-indigo-600 shrink-0">
                            +{item.qty} units
                          </span>
                          <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                            Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom section with forecast accuracy */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="text-sm font-bold text-slate-900 mb-4">Forecast Accuracy</div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { product: 'Almond Milk', accuracy: 94 },
                      { product: 'Wheat Bread', accuracy: 89 },
                      { product: 'Greek Yogurt', accuracy: 91 },
                    ].map((item) => (
                      <div key={item.product}>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-slate-600 font-medium">{item.product}</span>
                          <span className="text-slate-900 font-bold">{item.accuracy}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                            style={{ width: `${item.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mask/fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
