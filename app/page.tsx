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
    <>
      <StickyNav />
      <main className="min-h-screen bg-white pt-14">
        <Hero />
        <ProblemGrid />
        <FeatureGrid />
        <WorkflowComparison />
        <DashboardDemo />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-12">
            <SalesVelocityChartWrapper />
            <InventoryTable />
          </div>
        </section>

        <section className="py-20 bg-slate-50/50">
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
    </>
  )
}
