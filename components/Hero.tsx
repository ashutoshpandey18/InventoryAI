'use client'

import { useEffect, useRef } from 'react'
import { heroPreviewItems } from '@/lib/mock-data'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-slate-950">
      {/* Background Video Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Gradient Overlay with Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/35 to-slate-900/30" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(14, 116, 144, 0.15) 100%)',
          }}
        />
        
        {/* Subtle blur for cinematic depth */}
        <div className="absolute inset-0 backdrop-blur-[0.5px]" />
      </div>

      {/* Hero Content - Center Aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-60">
        <div className="flex flex-col items-center text-center">
          
          {/* Main Headline */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.4] tracking-tight text-white max-w-5xl"
            style={{ letterSpacing: '-0.02em' }}
          >
            The AI Layer for Your<br />Partner Ecosystem
          </h1>

          {/* 20-word Description */}
          <p className="text-base lg:text-lg text-white/80 leading-relaxed max-w-3xl mt-4">
            Automate partner discovery, onboarding, and revenue optimization with AI agents that understand your market and drive predictable channel growth.
          </p>

          {/* CTA Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a
              href="/signup"
              className="inline-flex items-center justify-center text-base font-semibold rounded-full px-8 py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl focus:ring-slate-900"
            >
              Book a Demo
            </a>
            <a
              href="/signup"
              className="inline-flex items-center justify-center text-base font-semibold rounded-full px-8 py-3.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-white text-slate-900 hover:bg-slate-50 shadow-lg hover:shadow-xl focus:ring-white"
            >
              Request Access
            </a>
          </div>

        </div>
      </div>

      {/* Dashboard Preview - Bottom of Hero, Overlapping Fold */}
      <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6 hidden lg:block">
        <div 
          className="dashboard-preview-container relative"
          style={{
            transform: 'perspective(1200px) rotateX(6deg) scale(0.98)',
            transformOrigin: 'center top',
          }}
        >
          {/* Dashboard Card with Cropped Bottom */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_96px_-16px_rgba(0,0,0,0.7),0_16px_48px_-8px_rgba(0,0,0,0.5)] border-2 border-white/20 ring-1 ring-black/5">
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/98 backdrop-blur-2xl" />
            
            {/* Dashboard Content - Visible portion */}
            <div className="relative h-[320px] overflow-hidden">
              <div className="bg-white">
                {/* Window chrome bar */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 ml-2">InventoryAI — Dashboard</span>
                </div>

                <div className="p-8 space-y-6">
                  {/* Metric chips row with mini sparklines */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-100 p-5 border border-emerald-200/60 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs font-bold text-emerald-700 tracking-wide uppercase">Total Pipeline</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 tracking-tight mb-2">$1.4M</div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-xs text-emerald-600 font-bold">↗ +6.8%</div>
                        <div className="text-xs text-slate-500">vs last month</div>
                      </div>
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-0.5 h-6">
                        {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 p-5 border border-indigo-200/60 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs font-bold text-indigo-700 tracking-wide uppercase">Revenue</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 tracking-tight mb-2">$525K</div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-xs text-indigo-600 font-bold">↗ +10.8%</div>
                        <div className="text-xs text-slate-500">vs last month</div>
                      </div>
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-0.5 h-6">
                        {[50, 60, 55, 75, 70, 85, 80, 95, 90, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-indigo-400 to-indigo-300 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 p-5 border border-purple-200/60 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-xs font-bold text-purple-700 tracking-wide uppercase">ARR Growth</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 tracking-tight mb-2">$263K</div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-xs text-purple-600 font-bold">↗ +5.5%</div>
                        <div className="text-xs text-slate-500">vs last month</div>
                      </div>
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-0.5 h-6">
                        {[45, 50, 60, 55, 70, 75, 80, 85, 90, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-purple-400 to-purple-300 rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chart Preview Section */}
                  <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900">Partner Performance</h3>
                      <div className="flex gap-1.5">
                        <button className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900 text-white">7D</button>
                        <button className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white text-slate-600 border border-slate-200">30D</button>
                        <button className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white text-slate-600 border border-slate-200">90D</button>
                      </div>
                    </div>
                    {/* Simple bar chart visualization */}
                    <div className="relative h-32 flex items-end gap-2">
                      {[65, 78, 82, 70, 88, 92, 85, 95, 90, 97, 94, 100].map((height, i) => (
                        <div key={i} className="flex-1 group cursor-pointer">
                          <div 
                            className="w-full bg-gradient-to-t from-indigo-500 via-indigo-400 to-indigo-300 rounded-t-lg group-hover:from-indigo-600 group-hover:via-indigo-500 transition-all shadow-sm"
                            style={{ height: `${height}%` }}
                          />
                          <div className="text-[10px] text-slate-500 text-center mt-1.5 font-medium">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Referrals to Approve - Enhanced */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Pending Referrals</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-300/50 shadow-sm">
                          3 awaiting
                        </span>
                        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View all →</button>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { company: 'Acme Corp', contact: 'Sarah Johnson', value: '$45,000', probability: 85, tag: 'Hot' },
                        { company: 'TechStart Inc', contact: 'Mike Chen', value: '$32,000', probability: 72, tag: 'Warm' },
                        { company: 'BuildFast', contact: 'Emily Rodriguez', value: '$28,500', probability: 68, tag: 'Warm' },
                      ].map((referral, idx) => (
                        <div
                          key={idx}
                          className="group flex items-center justify-between py-3.5 px-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 shadow-sm"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-indigo-700 text-sm border border-indigo-200">
                              {referral.company.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-bold text-slate-900">{referral.company}</div>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  referral.tag === 'Hot' 
                                    ? 'bg-red-100 text-red-700 border border-red-200' 
                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                  {referral.tag}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 mt-0.5 font-medium">{referral.contact}</div>
                              {/* Probability bar */}
                              <div className="mt-1.5 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                                    style={{ width: `${referral.probability}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">{referral.probability}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-900">{referral.value}</span>
                            <button className="px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs font-bold rounded-lg hover:from-slate-800 hover:to-slate-700 transition-all shadow-md hover:shadow-lg group-hover:scale-105">
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom fade mask - creates the "cropped" effect */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Floating glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl -z-10" />
        </div>
      </div>

      {/* Mobile Dashboard Preview */}
      <div className="lg:hidden relative z-20 w-full max-w-2xl mx-auto px-6 -mb-24 mt-16">
        <div 
          className="relative rounded-xl overflow-hidden shadow-[0_32px_96px_-16px_rgba(0,0,0,0.5)] border border-white/10"
          style={{
            transform: 'perspective(800px) rotateX(4deg) scale(0.98)',
          }}
        >
          <div className="relative h-[450px] overflow-hidden">
            <div className="bg-white">
              {/* Window chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-medium text-slate-600 ml-1">Dashboard</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <div className="text-[10px] text-slate-500 mb-1">Pipeline</div>
                    <div className="text-base font-bold text-slate-900">$1.4M</div>
                  </div>
                  <div className="rounded-lg bg-indigo-50 p-3 border border-indigo-200">
                    <div className="text-[10px] text-indigo-600 mb-1">Revenue</div>
                    <div className="text-base font-bold text-indigo-700">$525K</div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3 border border-purple-200">
                    <div className="text-[10px] text-purple-600 mb-1">ARR</div>
                    <div className="text-base font-bold text-purple-700">$263K</div>
                  </div>
                </div>

                {/* Referrals */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-900">Pending Referrals</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">3</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { company: 'Acme Corp', value: '$45K' },
                      { company: 'TechStart', value: '$32K' },
                      { company: 'BuildFast', value: '$28K' },
                    ].map((ref, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-800">{ref.company}</div>
                        </div>
                        <span className="text-xs font-bold text-slate-900">{ref.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
