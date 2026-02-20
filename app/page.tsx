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

          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}
