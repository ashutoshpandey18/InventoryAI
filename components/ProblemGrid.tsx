'use client'

import { AlertTriangle, DollarSign, Eye, Brain } from 'lucide-react'

const problems = [
  { icon: AlertTriangle, text: 'Stockouts cause lost sales', detail: 'Customer walks out, revenue gone.' },
  { icon: DollarSign, text: 'Overstock blocks capital', detail: 'Cash tied up in slow-moving goods.' },
  { icon: Eye, text: 'No demand visibility', detail: 'Selling blind without trend data.' },
  { icon: Brain, text: 'Reorders based on instinct', detail: 'Guesswork instead of forecasting.' },
]

export function ProblemGrid() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-sm font-medium text-indigo-600 mb-3">The problem</p>
        <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-12 max-w-xl">
          Retail inventory is still managed by gut feeling
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((problem) => {
            const Icon = problem.icon
            return (
              <div
                key={problem.text}
                className="bg-white rounded-xl border border-slate-100/80 p-6 space-y-3 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)]"
              >
                <div className="p-2.5 rounded-lg bg-white border border-slate-100 w-fit">
                  <Icon className="h-4 w-4 text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {problem.text}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {problem.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
