import { Star, Quote } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { testimonials } from '@/lib/data'

export function Testimonials() {
  return (
    <section id="testimonios" aria-labelledby="testimonios-title" className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6">
        <SectionHeading
          id="testimonios-title"
          eyebrow="Testimonios"
          title="Lo que dicen quienes ya probaron"
        />

        <ul
          aria-label="Testimonios de clientes. Desliza para ver más."
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <li key={t.name} className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-auto">
              <figure className="flex h-full flex-col gap-4 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/60 transition-shadow duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5" role="img" aria-label={`${t.rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={i < t.rating ? 'size-4 fill-honey text-honey' : 'size-4 text-border'}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <Quote className="size-6 text-secondary" aria-hidden="true" />
                </div>
                <blockquote className="flex-1 text-base leading-relaxed text-pretty">
                  <p>{`“${t.text}”`}</p>
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-dashed border-border pt-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-serif font-semibold" aria-hidden="true">
                    {t.name.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-bold">{t.name}</span>
                    <span className="text-sm text-muted-foreground">{t.occasion}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
