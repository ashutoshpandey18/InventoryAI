import { HTMLAttributes, forwardRef } from 'react'

type CardSurface = 'base' | 'elevated' | 'overlay'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  surface?: CardSurface
}

const surfaceStyles: Record<CardSurface, string> = {
  base: 'bg-white border-slate-200',
  elevated: 'bg-white border-slate-200 shadow-sm',
  overlay: 'bg-white border-slate-200 shadow-lg',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', elevated = false, surface, children, ...props }, ref) => {
    const level = surface ?? (elevated ? 'elevated' : 'base')
    return (
      <div
        ref={ref}
        className={`rounded-lg border transition-colors duration-150 ${surfaceStyles[level]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 py-5 ${className}`} {...props}>
    {children}
  </div>
)

const CardBody = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 py-5 ${className}`} {...props}>
    {children}
  </div>
)

const CardFooter = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-6 py-5 border-t border-slate-200 ${className}`} {...props}>
    {children}
  </div>
)

CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter }
