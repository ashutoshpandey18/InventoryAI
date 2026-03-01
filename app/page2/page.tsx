import { StickyNav } from '@/components/StickyNav'

export default function Page2() {
  return (
    <div className="relative min-h-screen bg-white">
      <StickyNav />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Page 2
          </h1>
          <p className="text-lg text-slate-600">
            This is the second page content.
          </p>
        </div>
      </main>
    </div>
  )
}
