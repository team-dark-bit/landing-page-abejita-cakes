import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:shadow-lg hover:-translate-y-0.5',
  secondary:
    'bg-secondary text-secondary-foreground hover:shadow-md hover:-translate-y-0.5',
  outline:
    'border border-primary/30 bg-card text-foreground hover:border-primary hover:-translate-y-0.5',
}

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  size?: 'md' | 'lg'
}

export function CtaLink({ variant = 'primary', size = 'md', className, ...props }: CtaLinkProps) {
  const isExternal = props.href?.startsWith('http')
  return (
    <a
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        size === 'lg' ? 'h-13 px-7 text-base' : 'h-11 px-5 text-sm',
        variants[variant],
        className,
      )}
    />
  )
}
