import React from 'react'
import { cn } from '@/lib/utils'

export default function Button({ children, variant = 'default', className = '', ...props }) {
  const base = 'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium'
  const variants = {
    default: 'bg-slate-800 text-white hover:bg-slate-700',
    outline: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
  }

  return (
    <button className={cn(base, variants[variant] || variants.default, className)} {...props}>
      {children}
    </button>
  )
}
