'use client'

import { useState } from 'react'
import { ProductCard } from './product-card'
import { SectionHeading } from './section-heading'
import { CtaLink } from './cta-link'
import { WhatsappIcon } from './brand-icons'
import type { PublicCategory } from '@/lib/api/categories'
import type { PublicProduct } from '@/lib/api/products'
import { whatsappLink } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

const ALL = 'todos'

export function Catalog({
  products,
  categories,
}: {
  products: PublicProduct[]
  categories: PublicCategory[]
}) {
  const [filter, setFilter] = useState<string>(ALL)
  const visible = filter === ALL ? products : products.filter((p) => p.category.slug === filter)
  const filters = [{ slug: ALL, name: 'Todos' }, ...categories]

  const countFor = (slug: string) =>
    slug === ALL ? products.length : products.filter((p) => p.category.slug === slug).length

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="bg-card/60 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6">
        <SectionHeading
          id="catalogo-title"
          eyebrow="Catálogo"
          title="Elige tu antojo, nosotros lo horneamos"
          description="Precios referenciales. Cada pedido se puede personalizar en sabor, tamaño y decoración."
        />

        {filters.length > 1 && (
          <div
            role="group"
            aria-label="Filtrar por categoría"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-center md:px-0"
          >
            {filters.map((f) => {
              const active = filter === f.slug
              return (
                <button
                  key={f.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.slug)}
                  className={cn(
                    'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary',
                  )}
                >
                  {f.name}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      active ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {countFor(f.slug)}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {`Mostrando ${visible.length} productos`}
        </p>

        {visible.length === 0 ? (
          <p className="rounded-2xl border bg-card px-5 py-6 text-base leading-relaxed text-muted-foreground">
            No pudimos cargar el catálogo en este momento. Escríbenos por WhatsApp y te contamos
            qué tenemos disponible hoy.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <li key={product.id} className="flex animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col items-center gap-4 rounded-3xl bg-secondary px-6 py-8 text-center md:flex-row md:justify-between md:px-10 md:text-left">
          <div className="flex flex-col gap-1">
            <p className="font-serif text-2xl font-semibold">{'¿No encuentras lo que buscas?'}</p>
            <p className="leading-relaxed text-secondary-foreground/80">
              Envíanos tu idea o una foto de referencia y te cotizamos sin compromiso.
            </p>
          </div>
          <CtaLink href={whatsappLink('¡Hola Abejita Cakes! Quisiera cotizar un pedido personalizado.')} size="lg" className="shrink-0">
            <WhatsappIcon className="size-5" />
            Cotizar mi pedido
          </CtaLink>
        </div>
      </div>
    </section>
  )
}
