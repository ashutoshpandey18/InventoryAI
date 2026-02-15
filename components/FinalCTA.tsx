'use client'

import { Button } from './ui/Button'

export function FinalCTA() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Start preventing stockouts today
              </h2>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                See how the system works with a live demo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button variant="secondary" size="lg">
                Schedule Demo
              </Button>
            </div>

            <p className="text-sm text-slate-500 pt-4">
              No credit card required • 14-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
