import { cn } from '@/lib/utils'

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        className="flex size-9 items-center justify-center bg-honey font-serif text-lg font-bold text-honey-foreground"
        style={{ clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)' }}
        aria-hidden="true"
      >
        A
      </span>
      <span className={cn('font-serif text-xl font-semibold leading-none tracking-tight', inverted ? 'text-primary-foreground' : 'text-foreground')}>
        Abejita <span className="italic font-normal">Cakes</span>
      </span>
    </span>
  )
}
