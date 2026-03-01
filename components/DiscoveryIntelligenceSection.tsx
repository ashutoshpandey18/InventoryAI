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
          if (entry.intersectionRatio >= 0.6) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
          }
        })
      },
      {
        threshold: [0, 0.6],
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
      className="py-20 bg-gradient-to-b from-white to-slate-50/30 relative"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side — Gradient Dashboard Frame */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #C7E0C2, #B8D8C8)',
              height: '600px',
            }}
          >
            {/* Invisible placeholder to prevent layout shift */}
            <div className="absolute inset-0 bg-white/0" style={{ opacity: 0 }} />

            {/* Dashboard — Slides up from bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: isVisible ? '32px' : '-40px',
                left: '50%',
                width: 'calc(100% - 64px)',
                maxWidth: '520px',
                opacity: isVisible ? 1 : 0,
                transform: `translateX(-50%) translateY(${isVisible ? '0px' : '120px'})`,
                transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                visibility: isVisible ? 'visible' : 'hidden',
                willChange: 'transform, opacity',
                zIndex: 10,
              }}
            >
              {/* Partner Discovery Dashboard */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Partner Discovery</h3>
                    <p className="text-xs text-slate-500 mt-0.5">AI-powered partner recommendations</p>
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
                    <div className="text-lg font-bold text-slate-900">2,847</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-slate-500 mb-0.5">New Matches</div>
                    <div className="text-lg font-bold text-slate-900">12</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-slate-500 mb-0.5">Avg Fit Score</div>
                    <div className="text-lg font-bold text-slate-900">87%</div>
                  </div>
                </div>

                {/* Table */}
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-3 text-xs font-medium text-slate-500 px-2">
                    <div className="col-span-3">Company</div>
                    <div className="col-span-2">Signals</div>
                    <div className="col-span-3">Fit</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Angle</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-2">
                    {/* Row 1 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                            A
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Acme Corp</div>
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
                          Tech
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">API</div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            V
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Vertex Inc</div>
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
                          SaaS
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">Embed</div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xs font-semibold">
                            Z
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Zenith Co</div>
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
                          Data
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">Plugin</div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 rounded-lg px-2 py-2.5">
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-xs font-semibold">
                            N
                          </div>
                          <div className="text-xs font-medium text-slate-900 truncate">Nova Labs</div>
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
                          AI
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-600 truncate">SDK</div>
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
                DISCOVERY INTELLIGENCE
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Find partners your competitors haven't found yet
            </h2>

            {/* Description */}
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl">
              Our AI continuously scans market signals, company activities, and integration patterns 
              to surface high-potential partners before they appear on anyone else's radar. 
              Stop relying on manual research and outdated databases.
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
                3x more qualified partners discovered
              </span>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                AI Discovery
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Fit Scoring
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Market Signals
              </div>
              <div className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                Partner Matching
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
