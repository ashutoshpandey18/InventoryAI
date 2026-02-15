'use client'

import { X, Check } from 'lucide-react'
import { manualWorkflow, predictiveWorkflow } from '@/lib/mock-data'

export function WorkflowComparison() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            From Spreadsheets to Automated Reorders
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Replace time-consuming spreadsheets and gut decisions with automated forecasting.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Manual Workflow */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Manual Process
                </h3>
              </div>
              <p className="text-slate-600 text-sm">
                Current inventory management approach
              </p>
            </div>

            <div className="space-y-3">
              {manualWorkflow.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-md bg-slate-50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                      <X className="h-3 w-3 text-slate-500" />
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Typical cycle time:</span>
                <span className="font-semibold text-slate-900">3-5 days</span>
              </div>
            </div>
          </div>

          {/* Predictive Workflow */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">
                  Predictive System
                </h3>
              </div>
              <p className="text-slate-600 text-sm">
                Automated inventory system
              </p>
            </div>

            <div className="space-y-3">
              {predictiveWorkflow.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-md bg-indigo-50/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 leading-relaxed">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Typical cycle time:</span>
                <span className="font-semibold text-indigo-600">30 minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Average time savings: 85% reduction in manual inventory planning tasks
          </p>
        </div>
      </div>
    </section>
  )
}
