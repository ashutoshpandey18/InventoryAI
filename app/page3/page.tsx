import { StickyNav } from '@/components/StickyNav'

export default function Page3() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <StickyNav />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Page 3
          </h1>
          <p className="text-lg text-slate-600">
            This is the third page content.
          </p>
        </div>
      </main>
    </div>
  )
}
