'use client'

import { TrendingUp, Clock, Archive, DollarSign, MessageSquare, Mic } from 'lucide-react'

interface Feature {
  icon: typeof TrendingUp
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: TrendingUp,
    title: 'Predictive Reorder',
    description: 'Calculates optimal reorder timing and quantities based on your sales patterns.',
  },
  {
    icon: Clock,
    title: 'Runout Forecast',
    description: 'Shows exact days until stock depletion based on current sales velocity.',
  },
  {
    icon: Archive,
    title: 'Slow Stock Detection',
    description: 'Identifies slow-moving inventory early with recommendations to free up capital.',
  },
  {
    icon: DollarSign,
    title: 'Lost Sales Tracking',
    description: 'Calculates revenue lost from stockouts and overstock situations.',
  },
  {
    icon: MessageSquare,
    title: 'Explainable Decisions',
    description: 'Every recommendation comes with clear reasoning and data sources you can verify and trust.',
  },
  {
    icon: Mic,
    title: 'Voice Queries',
    description: 'Ask questions naturally and get instant answers about inventory status, trends, and recommendations.',
  },
]

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-sm font-medium text-indigo-600 mb-3">Features</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 max-w-lg">
            How it works
          </h2>
          <p className="text-base text-slate-500 max-w-xl">
            Automated forecasting and data-driven reorder recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-slate-100 p-7 hover:border-slate-200 transition-colors duration-150"
              >
                <div className="mb-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border border-slate-100">
                    <Icon className="h-5 w-5 text-slate-600" />
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
