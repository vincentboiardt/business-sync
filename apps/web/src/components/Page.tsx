import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function Page({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 py-8', className)}>
      {children}
    </div>
  )
}
