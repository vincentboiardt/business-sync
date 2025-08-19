import { ReactNode } from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white hover:bg-brand/90 focus:ring-brand disabled:hover:bg-brand',
        secondary:
          'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:hover:bg-gray-100',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand disabled:hover:bg-white',
        ghost:
          'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:hover:bg-transparent',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:hover:bg-red-600',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:hover:bg-green-600',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  children?: ReactNode
  className?: string
  href?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button = ({
  variant,
  size,
  className,
  children,
  href,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  const classNames = cn(buttonVariants({ variant, size }), className)

  if (href) {
    return (
      <Link className={classNames} href={href} {...props}>
        {children}
      </Link>
    )
  } else {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={classNames}
        {...props}
      >
        {children}
      </button>
    )
  }
}

Button.displayName = 'Button'

export default Button
