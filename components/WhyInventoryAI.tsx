export function WhyInventoryAI() {
  return (
    <section className="py-16 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Eyebrow */}
        <div className="text-center mb-5">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            WHY INVENTORYAI
          </p>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center leading-tight max-w-[900px] mx-auto mb-16">
          Your inventory operations deserve better than spreadsheets
        </h2>

        {/* Two-Card Layout */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Card — The Problem */}
          <div className="bg-slate-100 rounded-3xl p-7 sm:p-10 lg:p-12">
            {/* Eyebrow */}
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">
              THE PROBLEM
            </p>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
              Inventory teams are drowning
            </h3>

            {/* Bullet Points */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  Spreadsheets tracking hundreds of SKUs with no single source of truth
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  Missed restock dates and stockout risks hurting revenue
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  No real-time visibility into inventory across locations
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <span>
                  Hours spent manually reconciling stock and forecasts
                </span>
              </li>
            </ul>
          </div>

          {/* Right Card — The Solution */}
          <div className="rounded-3xl p-7 sm:p-10 lg:p-12" style={{ backgroundColor: '#F5EDE3' }}>
            {/* Eyebrow */}
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-3">
              THE SOLUTION
            </p>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
              InventoryAI replaces the chaos
            </h3>

            {/* Bullet Points */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span>
                  AI forecasts demand before stockouts happen
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span>
                  Automated replenishment and purchase planning
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span>
                  Real-time multi-location inventory visibility
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                <span>
                  One platform from intake to fulfillment analytics
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
