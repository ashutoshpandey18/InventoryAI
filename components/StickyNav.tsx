'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Product', href: '#product' }                                                                                                  ,
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Sign In', href: '/signin' },
]

export function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Trigger transformation after scrolling past announcement bar
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    handleScroll() // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) return
    
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)

    if (element) {
      // Account for announcement bar (38px) + navbar height (64px when scrolled) + padding
      const offset = 110
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled ? 'top-[42px]' : 'top-[38px]'
      }`}
      style={{
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div 
        className={`mx-auto transition-all duration-200 ease-out ${
          isScrolled 
            ? 'max-w-3xl px-3 lg:px-4' 
            : 'max-w-3xl px-4 lg:px-6'
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-300 ease-out ${
            isScrolled 
              ? 'h-[64px] bg-white/70 backdrop-blur-xl backdrop-saturate-150 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.15)] px-5' 
              : 'h-20 bg-transparent px-3'
          }`}
          style={{
            transform: isScrolled ? 'scale(1)' : 'scale(1)',
            opacity: 1,
            backdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'none',
            border: isScrolled ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
            willChange: isScrolled ? 'backdrop-filter' : 'auto',
            pointerEvents: 'auto',
          }}
        >
          {/* Logo - Left */}
          <a
            href="/"
            className={`text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-2 py-1 tracking-tight transition-colors duration-200 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}
          >
            InventoryAI
          </a>

          {/* Navigation Links — Center Desktop */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium transition-all duration-200 rounded-full px-4 py-2 ${
                  isScrolled 
                    ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA — Right Desktop */}
          <div className="hidden md:flex items-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold rounded-full px-6 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg focus:ring-slate-900"
            >
              Book a Demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md transition-colors duration-200 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute left-0 right-0 mt-4 mx-4 bg-white/65 backdrop-blur-xl backdrop-saturate-150 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-200 ${
            isScrolled ? 'top-full' : 'top-20'
          }`}
            style={{
              backdropFilter: 'blur(24px) saturate(150%)',
              WebkitBackdropFilter: 'blur(24px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              willChange: 'backdrop-filter',
            }}
          >
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 py-3 px-4 rounded-xl font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="/signup"
                  className="block text-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full px-4 py-3 shadow-md transition-all duration-200"
                >
                  Book a Demo
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
