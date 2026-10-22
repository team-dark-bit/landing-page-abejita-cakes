import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ id, eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col gap-3',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/80">
        <span className="size-2 rotate-45 rounded-[2px] bg-honey" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={id} className="font-serif text-3xl font-semibold leading-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">{description}</p>
      )}
    </div>
  )
}
