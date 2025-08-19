import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string | ReactNode
  className?: string
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-paper shadow-xl rounded-lg ${className}`}>
      {title && (
        <div className="flex items-center justify-between p-6 border-b border-border">
          {typeof title === 'string' ? (
            <h2 className="text-xl font-semibold">{title}</h2>
          ) : (
            title
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
