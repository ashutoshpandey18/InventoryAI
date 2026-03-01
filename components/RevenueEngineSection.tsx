'use client'

import { useEffect, useRef, useState } from 'react'

export function RevenueEngineSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show dashboard when 60% visible, hide when below 60%
        if (entry.intersectionRatio >= 0.6) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      {
        threshold: [0, 0.6], // Track at 0% and 60% for bidirectional animation
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
      className="relative bg-white py-20"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Dashboard Frame */}
          <div className="relative">
            {/* Gradient Frame Container */}
            <div 
              className="relative rounded-3xl overflow-hidden flex flex-col justify-start pt-10 px-10 pb-10 min-h-[520px] md:min-h-[520px]"
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
                      <h3 className="text-xl font-bold text-slate-900">Commissions</h3>
                      <p className="text-sm text-slate-600 mt-1">Track partner payouts</p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-xs text-slate-600 font-semibold uppercase tracking-wide mb-1">Total</div>
                        <div className="text-xl font-bold text-slate-900">$847K</div>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-1">Paid</div>
                        <div className="text-xl font-bold text-emerald-900">$625K</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Approved</div>
                        <div className="text-xl font-bold text-blue-900">$158K</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">Pending</div>
                        <div className="text-xl font-bold text-amber-900">$64K</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-700">Commission Status</span>
                        <span className="text-slate-900">74% Paid</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: '74%' }} />
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: '19%' }} />
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '7%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Top Partners</div>
                      <div className="space-y-2">
                        {[
                          { name: 'Accenture', amount: '$182K', status: 'Paid', statusColor: 'emerald' },
                          { name: 'Deloitte', amount: '$156K', status: 'Paid', statusColor: 'emerald' },
                          { name: 'PwC', amount: '$142K', status: 'Approved', statusColor: 'blue' },
                          { name: 'EY', amount: '$128K', status: 'Pending', statusColor: 'amber' },
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
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="text-xs font-bold tracking-widest uppercase text-slate-500">
              Revenue Engine
            </div>

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Maximize your partner revenue
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Automate commission tracking, deal pipeline management, and revenue attribution. 
              Give your partners real-time visibility into their earnings while you maintain full control.
            </p>

            {/* Highlight Metric */}
            <div className="inline-flex items-center px-5 py-3 rounded-full bg-slate-100 border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                <span className="text-slate-900 font-bold">$2.1M</span> average partner-sourced revenue per customer
              </span>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Commissions
                </button>
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Deal Pipeline
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Invoicing
                </button>
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Revenue Attribution
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
