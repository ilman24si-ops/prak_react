import React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ children, className = '' }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-800', className)}>
      {children}
    </span>
  )
}

export default Badge
