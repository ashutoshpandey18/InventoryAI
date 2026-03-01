'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface RollingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'md' | 'lg'
  children: string
}

export const RollingButton = forwardRef<HTMLButtonElement, RollingButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'lg',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'rolling-button relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden'

    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5',
      secondary:
        'bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl',
    }

    const sizes = {
      md: 'h-11 px-6 text-sm rounded-full',
      lg: 'h-14 px-8 text-base rounded-full',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        <span className="rolling-text-wrapper">
          <span className="rolling-text-content">
            {children}
          </span>
          <span className="rolling-text-content" aria-hidden="true">
            {children}
          </span>
        </span>
      </button>
    )
  }
)

RollingButton.displayName = 'RollingButton'
