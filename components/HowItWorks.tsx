'use client'

import { useEffect, useRef, useState } from 'react'

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  const steps = [
    {
      number: '1',
      title: 'Connect',
      description: 'Connect your ERP, POS, and warehouse systems, define SKU rules, and set inventory thresholds.',
      heightClass: 'lg:min-h-[220px]',
      delay: '0ms',
    },
    {
      number: '2',
      title: 'Forecast',
      description: 'AI analyzes sales velocity, seasonality, and lead times to predict future demand.',
      heightClass: 'lg:min-h-[260px]',
      delay: '80ms',
    },
    {
      number: '3',
      title: 'Automate',
      description: 'Automate replenishment, transfer orders, and supplier workflows across locations.',
      heightClass: 'lg:min-h-[300px]',
      delay: '160ms',
    },
    {
      number: '4',
      title: 'Optimize',
      description: 'AI monitors stock health, reduces carrying costs, and prevents stockouts in real time.',
      heightClass: 'lg:min-h-[280px]',
      delay: '120ms',
    },
  ]

  return (
    <section id="how-it-works" ref={sectionRef} className="py-16 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Eyebrow */}
        <div className="text-center mb-5">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            HOW IT WORKS
          </p>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center leading-tight max-w-[900px] mx-auto mb-16">
          Up and running in four steps
        </h2>

        {/* Steps Grid - Top Aligned on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:items-start">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`rounded-3xl p-8 ${step.heightClass}`}
              style={{
                backgroundColor: '#F3EDE7',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease-out ${step.delay}, transform 0.6s ease-out ${step.delay}`,
              }}
            >
              {/* Step Number */}
              <div className="text-slate-600 text-sm mb-4">
                {step.number}
              </div>

              {/* Step Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-slate-700 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
