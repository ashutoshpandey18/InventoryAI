'use client'

import { useEffect, useState } from 'react'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[60]
        h-[38px] w-full
        bg-black
        flex items-center justify-center
        transition-opacity duration-700 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <p className="text-white text-[13px] font-normal tracking-wide text-center px-4">
        Website under maintenance - for any queries contact me on{' '}
        <a
          href="mailto:wwrajneesh807@gmail.com"
          className="underline hover:text-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white rounded"
        >
          wwrajneesh807@gmail.com
        </a>
      </p>
    </div>
  )
}
