/**
 * Utility functions for common formatting and helper operations
 * @module utils
 */

/**
 * Format a date in US locale format (e.g., "Jan 1, 2024")
 * 
 * @param {Date} [date=new Date()] - The date to format, defaults to current date
 * @returns {string} Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date('2024-01-15'))
 * // Returns: "Jan 15, 2024"
 * ```
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a date with time in US locale format (e.g., "Jan 1, 2024, 02:30 PM")
 * 
 * @param {Date} [date=new Date()] - The date to format, defaults to current date
 * @returns {string} Formatted date and time string
 * 
 * @example
 * ```typescript
 * formatDateTime(new Date('2024-01-15T14:30:00'))
 * // Returns: "Jan 15, 2024, 02:30 PM"
 * ```
 */
export function formatDateTime(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format currency with K suffix for thousands
 * 
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with $ symbol
 * 
 * @example
 * ```typescript
 * formatCurrency(1500)  // Returns: "$1.5K"
 * formatCurrency(500)   // Returns: "$500"
 * formatCurrency(45000) // Returns: "$45.0K"
 * ```
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`
  }
  return `$${amount.toFixed(0)}`
}

/**
 * Conditionally join CSS class names, filtering out falsy values
 * 
 * Similar to the popular `classnames` library but lightweight.
 * Useful for conditional className construction in React components.
 * 
 * @param {...(string | boolean | undefined | null)[]} classes - Class names to join
 * @returns {string} Space-separated string of truthy class names
 * 
 * @example
 * ```typescript
 * clsx('btn', isActive && 'active', 'primary')
 * // Returns: "btn active primary" (if isActive is true)
 * 
 * clsx('card', false && 'hidden', null, undefined, 'shadow')
 * // Returns: "card shadow"
 * ```
 */
export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
