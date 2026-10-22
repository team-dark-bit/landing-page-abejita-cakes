'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SectionHeading } from './section-heading'
import { gallery } from '@/lib/data'
import { cn } from '@/lib/utils'

const aspect = {
  portrait: 'aspect-3/4',
  landscape: 'aspect-4/3',
  square: 'aspect-square',
}

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const current = index !== null ? gallery[index] : null

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length))

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6">
        <SectionHeading
          id="galeria-title"
          eyebrow="Trabajos realizados"
          title="Pedidos que ya endulzaron una fiesta"
          description="Fotos de tortas y bocaditos entregados a nuestros clientes en Ayacucho."
        />

        <ul className="columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
          {gallery.map((item, i) => (
            <li key={item.src} className="mb-3 break-inside-avoid md:mb-5">
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`Ampliar imagen: ${item.caption}`}
              >
                <div className={cn('relative w-full', aspect[item.orientation])}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  />
                </div>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-foreground/75 to-transparent p-3 pt-10 text-left text-xs font-semibold text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:text-sm">
                  {item.caption}
                  <Expand className="size-4 shrink-0" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={index !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <DialogContent
          className="max-w-[calc(100%-1.5rem)] gap-3 bg-card p-3 sm:max-w-3xl"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1)
            if (e.key === 'ArrowLeft') go(-1)
          }}
        >
          {current && (
            <>
              <div className="relative h-[70vh] w-full overflow-hidden rounded-xl bg-muted">
                <Image src={current.src} alt={current.alt} fill sizes="(min-width: 768px) 768px, 100vw" className="object-contain" />
              </div>
              <div className="flex items-center justify-between gap-3 px-1">
                <div className="flex min-w-0 flex-col">
                  <DialogTitle className="font-serif text-lg font-semibold">{current.caption}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {`${(index ?? 0) + 1} de ${gallery.length}`}
                  </DialogDescription>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                    <span className="sr-only">Imagen anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                    <span className="sr-only">Imagen siguiente</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
