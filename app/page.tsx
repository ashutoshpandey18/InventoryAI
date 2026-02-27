import { StickyNav } from '@/components/StickyNav'
import { Hero } from '@/components/Hero'
import { ProblemGrid } from '@/components/ProblemGrid'
import { FeatureGrid } from '@/components/FeatureGrid'
import { WorkflowComparison } from '@/components/WorkflowComparison'
import { DashboardDemo } from '@/components/DashboardDemo'
import { SalesVelocityChartWrapper } from '@/components/SalesVelocityChartWrapper'
import { InventoryTable } from '@/components/InventoryTable'
import { AIAssistantPreview } from '@/components/AIAssistantPreview'
import { FinalCTA } from '@/components/FinalCTA'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative bg-white">

      {/* ─── Luminous ambient background layer ─── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Shape 1 — top-right, indigo whisper */}
        <div
          className="absolute rounded-full"
          style={{
            width: '760px',
            height: '760px',
            top: '-120px',
            right: '-180px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 68%)',
            filter: 'blur(140px)',
            animation: 'ambientFloat1 40s ease-in-out infinite',
          }}
        />
        {/* Shape 2 — bottom-left, slate whisper */}
        <div
          className="absolute rounded-full"
          style={{
            width: '700px',
            height: '700px',
            bottom: '-80px',
            left: '-160px',
            background: 'radial-gradient(circle, rgba(148,163,184,0.07) 0%, transparent 68%)',
            filter: 'blur(130px)',
            animation: 'ambientFloat2 44s ease-in-out infinite',
          }}
        />
        {/* Shape 3 — mid-center, violet whisper */}
        <div
          className="absolute rounded-full"
          style={{
            width: '620px',
            height: '620px',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(139,92,246,0.045) 0%, transparent 65%)',
            filter: 'blur(150px)',
            animation: 'ambientFloat3 48s ease-in-out infinite',
          }}
        />
        {/* Grain / noise overlay — 2.5% opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            opacity: 0.025,
          }}
        />
      </div>

      {/* ─── Page content ─── */}
      <div className="relative" style={{ zIndex: 1 }}>
        <StickyNav />
        <main className="min-h-screen pt-14">
          <Hero />
          <ProblemGrid />
          <FeatureGrid />
          <WorkflowComparison />
          <DashboardDemo />

          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-12">
              <SalesVelocityChartWrapper />
              <InventoryTable />
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-10">
              <div className="mb-10">
                <p className="text-sm font-medium text-indigo-600 mb-3">Assistant</p>
                <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
                  Ask your inventory anything
                </h2>
                <p className="text-base text-slate-500 max-w-xl">
                  Natural-language queries against your live data.
                </p>
              </div>
              <AIAssistantPreview />
            </div>
          </section>

          <section id="pricing" className="py-20 bg-slate-50/50">
            <div className="max-w-5xl mx-auto px-6 lg:px-10">
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-indigo-600 mb-3">Pricing</p>
                <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
                  Simple, transparent pricing
                </h2>
                <p className="text-base text-slate-500 max-w-2xl mx-auto">
                  Choose the plan that works for your business. All plans include a 14-day free trial.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Starter Plan */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Starter</h3>
                  <p className="text-sm text-slate-500 mb-4">Perfect for small businesses</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-slate-900">$49</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Up to 100 products
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic forecasting
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Email support
                    </li>
                  </ul>
                  <button className="w-full py-2.5 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                    Start Free Trial
                  </button>
                </div>
                {/* Professional Plan */}
                <div className="bg-indigo-600 rounded-xl border border-indigo-700 p-6 shadow-lg relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Professional</h3>
                  <p className="text-sm text-indigo-100 mb-4">For growing businesses</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">$149</span>
                    <span className="text-indigo-100">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-white">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited products
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced AI forecasting
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-start gap-2 text-sm text-white">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      API access
                    </li>
                  </ul>
                  <button className="w-full py-2.5 px-4 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                    Start Free Trial
                  </button>
                </div>
                {/* Enterprise Plan */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Enterprise</h3>
                  <p className="text-sm text-slate-500 mb-4">For large organizations</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-slate-900">Custom</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Everything in Professional
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dedicated support
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Custom integrations
                    </li>
                  </ul>
                  <button className="w-full py-2.5 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="py-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-10">
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-indigo-600 mb-3">About Us</p>
                <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
                  Built by inventory experts
                </h2>
                <p className="text-base text-slate-500 max-w-2xl mx-auto">
                  We've spent years helping businesses optimize their inventory. Now we're bringing
                  that expertise to you through intelligent automation.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                    <div className="text-sm text-slate-600">Businesses served</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">$2M+</div>
                    <div className="text-sm text-slate-600">Revenue saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">99.9%</div>
                    <div className="text-sm text-slate-600">Uptime guarantee</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}
