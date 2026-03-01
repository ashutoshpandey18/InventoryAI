'use client'

import { useEffect, useRef, useState } from 'react'

export function DealPipelineSection() {
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
      className="relative bg-white py-28"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="text-xs font-bold tracking-widest uppercase text-slate-500">
              AI-Native PRM
            </div>

            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight max-w-lg">
              Manage your entire partner lifecycle in one place
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              From discovery to deal closure, track every interaction, qualification step, and revenue milestone. 
              AI-powered insights help you prioritize high-value partners and identify risks before they become problems.
            </p>

            {/* Highlight Metric */}
            <div className="inline-flex items-center px-5 py-3 rounded-full bg-slate-100 border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                <span className="text-slate-900 font-bold">60%</span> less time on partner admin
              </span>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-4">
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  AI Insights
                </button>
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Health Scores
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Partner Portal
                </button>
                <button className="px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  Onboarding
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Dashboard Frame */}
          <div className="relative">
            {/* Gradient Frame Container */}
            <div 
              className="relative rounded-3xl p-8 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #F1A7A7 0%, #E7BDBD 100%)',
              }}
            >
              {/* Empty placeholder - only visible when dashboard is shown */}
              <div 
                className="bg-white/0 rounded-2xl p-6 min-h-[500px] relative"
                style={{
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              >
                {/* Invisible spacer */}
              </div>

              {/* Animated Kanban Dashboard - Slides Up from Bottom */}
              <div 
                className="absolute z-10"
                style={{
                  bottom: isVisible ? '32px' : '-40px',
                  left: '50%',
                  width: 'calc(100% - 64px)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? 'translateX(-50%) translateY(0)' 
                    : 'translateX(-50%) translateY(120px)',
                  pointerEvents: 'none',
                  visibility: isVisible ? 'visible' : 'hidden',
                  willChange: 'transform, opacity',
                  transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div className="bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-slate-900/5">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900">Deal Pipeline</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white">
                          Kanban
                        </button>
                        <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-600 border border-slate-200 hover:bg-slate-50">
                          Table
                        </button>
                      </div>
                    </div>

                    {/* Kanban Columns */}
                    <div className="grid grid-cols-5 gap-3 overflow-x-auto">
                      {/* Registered */}
                      <div className="min-w-[140px]">
                        <div className="bg-slate-100 rounded-lg p-3">
                          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                            Registered
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">Acme Corp</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$120K</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">BuildCo</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$95K</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Qualified */}
                      <div className="min-w-[140px]">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3">
                            Qualified
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">TechStart</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$180K</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">DataFlow</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$145K</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Proposal */}
                      <div className="min-w-[140px]">
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-3">
                            Proposal
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-indigo-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">CloudSync</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$220K</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Negotiation */}
                      <div className="min-w-[140px]">
                        <div className="bg-amber-50 rounded-lg p-3">
                          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">
                            Negotiation
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-amber-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">Enterprise X</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$340K</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-amber-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">Global Inc</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$290K</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Won */}
                      <div className="min-w-[140px]">
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
                            Won
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
                              <div className="text-sm font-bold text-slate-900">Innovate Ltd</div>
                              <div className="text-xs text-emerald-600 font-semibold mt-1">$450K</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
