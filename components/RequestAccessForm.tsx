'use client'

import { useState } from 'react'

export function RequestAccessForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    storeName: '',
    storeType: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 text-center mb-8">
          Get Early Access
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate-900 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-900 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150"
              />
            </div>

            {/* Store Name */}
            <div>
              <label htmlFor="storeName" className="block text-xs font-medium text-slate-900 mb-1.5">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Your store name"
                className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150"
              />
            </div>

            {/* Store Type */}
            <div>
              <label htmlFor="storeType" className="block text-xs font-medium text-slate-900 mb-1.5">
                Store Type
              </label>
              <div className="relative">
                <select
                  id="storeType"
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150 cursor-pointer"
                >
                  <option value="">Select...</option>
                  <option value="grocery">Grocery Store</option>
                  <option value="electronics">Electronics Store</option>
                  <option value="clothing">Clothing Store</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="other">Other</option>
                </select>
                {/* Dropdown Arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 h-11 bg-slate-900 text-white text-sm rounded-lg font-semibold hover:bg-slate-800 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Join Early Access
          </button>
        </form>
      </div>
    </section>
  )
}
