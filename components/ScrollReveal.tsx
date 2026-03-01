'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
}

export function ScrollReveal({ children }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate scroll progress when element enters viewport
      // Start animation when top of container is at bottom of viewport
      // Complete when top reaches middle of viewport
      const startPoint = windowHeight
      const endPoint = windowHeight * 0.3
      
      if (rect.top <= startPoint && rect.top >= endPoint) {
        const progress = 1 - (rect.top - endPoint) / (startPoint - endPoint)
        setScrollProgress(Math.max(0, Math.min(1, progress)))
      } else if (rect.top < endPoint) {
        setScrollProgress(1)
      } else {
        setScrollProgress(0)
      }
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate transform values based on scroll progress
  const translateY = (1 - scrollProgress) * 100 // Move from 100px down to 0
  const scale = 0.95 + scrollProgress * 0.05 // Scale from 0.95 to 1
  const opacity = 0.3 + scrollProgress * 0.7 // Fade from 0.3 to 1

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        transition: 'opacity 0.1s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}
