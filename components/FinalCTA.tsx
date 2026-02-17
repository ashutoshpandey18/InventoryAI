'use client'

import { Button } from './ui/Button'

export function FinalCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900">
            Start preventing stockouts today
          </h2>

          <p className="text-base text-slate-500 max-w-lg mx-auto">
            See how the system works with a live demo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
            <Button variant="secondary" size="lg">
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm text-slate-400">
            No credit card required · 14-day trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
