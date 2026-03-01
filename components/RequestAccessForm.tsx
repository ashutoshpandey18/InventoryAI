'use client'

import { useState } from 'react'

export function RequestAccessForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    company: '',
    companySize: '',
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
      <div className="max-w-2xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 text-center mb-8">
          Request Access
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
                placeholder="Jane Smith"
                className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150"
              />
            </div>

            {/* Work Email */}
            <div>
              <label htmlFor="workEmail" className="block text-xs font-medium text-slate-900 mb-1.5">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="workEmail"
                name="workEmail"
                required
                value={formData.workEmail}
                onChange={handleChange}
                placeholder="jane@company.com"
                className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-xs font-medium text-slate-900 mb-1.5">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc"
                className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150"
              />
            </div>

            {/* Company Size */}
            <div>
              <label htmlFor="companySize" className="block text-xs font-medium text-slate-900 mb-1.5">
                Company Size
              </label>
              <div className="relative">
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-sm bg-slate-100 rounded-lg text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-150 cursor-pointer"
                >
                  <option value="">Select...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
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
            Request Access
          </button>
        </form>
      </div>
    </section>
  )
}
