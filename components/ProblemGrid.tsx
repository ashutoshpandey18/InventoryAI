'use client'

import { AlertTriangle, DollarSign, Eye, Brain } from 'lucide-react'

const problems = [
  { icon: AlertTriangle, text: 'Stockouts cause lost sales' },
  { icon: DollarSign, text: 'Overstock blocks capital' },
  { icon: Eye, text: 'No demand visibility' },
  { icon: Brain, text: 'Reorders based on instinct' },
]

export function ProblemGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
        {problems.map((problem) => {
          const Icon = problem.icon
          return (
            <div
              key={problem.text}
              className="group rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-200"
            >
              <div className="p-6 space-y-4">
                <div className="p-3 rounded-lg bg-slate-50 w-fit">
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors duration-200" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-900">
                  {problem.text}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
