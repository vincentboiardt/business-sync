import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  children?: ReactNode
}

export function PageHeader({
  title,
  description,
  className = '',
  children,
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && <p className="text-lg text-subdued">{description}</p>}
        </div>
        {children && (
          <div className="flex items-center space-x-4">{children}</div>
        )}
      </div>
    </div>
  )
}
