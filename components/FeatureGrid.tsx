'use client'

import { TrendingUp, Clock, Archive, DollarSign, MessageSquare, Mic } from 'lucide-react'

interface Feature {
  icon: typeof TrendingUp
  title: string
  description: string
  iconColor: string
  iconBg: string
}

const features: Feature[] = [
  {
    icon: TrendingUp,
    title: 'Predictive Reorder',
    description: 'Calculates optimal reorder timing and quantities based on your sales patterns.',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
  },
  {
    icon: Clock,
    title: 'Runout Forecast',
    description: 'Shows exact days until stock depletion based on current sales velocity.',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
  },
  {
    icon: Archive,
    title: 'Slow Stock Detection',
    description: 'Identifies slow-moving inventory early with recommendations to free up capital.',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
  },
  {
    icon: DollarSign,
    title: 'Lost Sales Tracking',
    description: 'Calculates revenue lost from stockouts and overstock situations.',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
  },
  {
    icon: MessageSquare,
    title: 'Explainable Decisions',
    description: 'Every recommendation comes with clear reasoning and data sources you can verify and trust.',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
  },
  {
    icon: Mic,
    title: 'Voice Queries',
    description: 'Ask questions naturally and get instant answers about inventory status, trends, and recommendations.',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
  },
]

export function FeatureGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Automated forecasting and data-driven reorder recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-white rounded-lg border border-slate-200 p-8 transition-shadow duration-200"
              >
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.iconBg}`}>
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
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
