import Image from 'next/image'
import { Ruler } from 'lucide-react'
import { WhatsappIcon } from './brand-icons'
import type { Product } from '@/lib/data'
import { formatPrice, productWhatsappLink } from '@/lib/whatsapp'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 motion-reduce:hover:translate-y-0">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 rounded-full bg-card/95 px-3 py-1 text-xs font-bold text-foreground shadow-sm">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-xl font-semibold leading-snug">{product.name}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
          <Ruler className="size-4 text-primary" aria-hidden="true" />
          <span className="sr-only">Tamaño:</span>
          {product.size}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-border pt-4">
          <p className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Desde</span>
            <span className="font-serif text-2xl font-semibold text-primary">{formatPrice(product.priceFrom)}</span>
          </p>
          <a
            href={productWhatsappLink(product.name, product.size)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            aria-label={`Pedir ${product.name} por WhatsApp`}
          >
            <WhatsappIcon className="size-4" />
            Pedir
          </a>
        </div>
      </div>
    </article>
  )
}
