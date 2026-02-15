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
      <main className="min-h-screen bg-white pt-16">
        <Hero />
        <ProblemGrid />
        <FeatureGrid />
        <WorkflowComparison />
        <DashboardDemo />

        <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <SalesVelocityChartWrapper />
          <InventoryTable />
        </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <AIAssistantPreview />
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
