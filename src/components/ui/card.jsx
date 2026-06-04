import React from 'react'
import { cn } from '@/lib/utils'

export default function Card({ children, className = '' }) {
  return (
    <div className={cn('p-4 bg-white rounded-lg shadow-sm', className)}>
      {children}
    </div>
  )
}
