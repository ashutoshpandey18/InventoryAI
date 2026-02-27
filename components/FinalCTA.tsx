'use client'

import { Button } from './ui/Button'

export function FinalCTA() {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div className="text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900">
            Start preventing stockouts today
          </h2>

          <p className="text-base text-slate-500 max-w-lg mx-auto">
            Join hundreds of businesses using InventoryAI to optimize their inventory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a href="/signup">
              <Button variant="primary" size="lg">
                Start Free Trial
              </Button>
            </a>
            <a href="/signin">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </a>
          </div>

          <p className="text-sm text-slate-400">
            No credit card required · 14-day trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
