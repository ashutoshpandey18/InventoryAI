'use client'

import { X, Check } from 'lucide-react'
import { manualWorkflow, predictiveWorkflow } from '@/lib/mock-data'

export function WorkflowComparison() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <p className="text-sm font-medium text-indigo-600 mb-3">Comparison</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 max-w-2xl">
            From spreadsheets to automated reorders
          </h2>
          <p className="text-base text-slate-500 max-w-xl">
            Replace time-consuming spreadsheets and gut decisions with automated forecasting.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Manual Workflow */}
          <div className="bg-white/70 rounded-xl border border-slate-100/80 p-7 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)]">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Manual Process
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Current inventory management approach
              </p>
            </div>

            <div className="space-y-2">
              {manualWorkflow.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-lg bg-white border border-slate-100"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                      <X className="h-3 w-3 text-slate-400" />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Typical cycle time</span>
                <span className="font-semibold text-slate-900">3–5 days</span>
              </div>
            </div>
          </div>

          {/* Predictive Workflow */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-7 shadow-[0_4px_32px_-8px_rgba(0,0,0,0.06),0_1px_8px_-2px_rgba(0,0,0,0.03)]">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  Predictive System
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Automated inventory system
              </p>
            </div>

            <div className="space-y-2">
              {predictiveWorkflow.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-lg bg-indigo-50/40 border border-indigo-100/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Typical cycle time</span>
                <span className="font-semibold text-indigo-600">30 minutes</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-400 text-center">
          Average time savings: 85% reduction in manual inventory planning tasks
        </p>
      </div>
    </section>
  )
}
