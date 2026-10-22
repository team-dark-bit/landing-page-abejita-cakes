import Image from 'next/image'
import { ArrowDown, Star } from 'lucide-react'
import { CtaLink } from './cta-link'
import { WhatsappIcon } from './brand-icons'
import { whatsappLink } from '@/lib/whatsapp'

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-16 md:px-6 md:pt-14 lg:grid-cols-2 lg:gap-14 lg:pb-24">
        <div className="flex flex-col items-start gap-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-bold text-secondary-foreground animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both">
            Repostería artesanal en Huamanga, Ayacucho
          </p>
          <h1
            id="hero-title"
            className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both"
          >
            Tortas y bocaditos hechos con amor para tus{' '}
            <em className="font-normal italic text-primary">momentos especiales</em>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
            Horneamos cada pedido el mismo día de tu evento, con insumos frescos y recetas de casa.
            Eliges, nos escribes por WhatsApp y nosotros nos encargamos del resto.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <CtaLink href="#catalogo" size="lg">
              Ver catálogo
              <ArrowDown className="size-4" aria-hidden="true" />
            </CtaLink>
            <CtaLink href={whatsappLink()} size="lg" variant="outline">
              <WhatsappIcon className="size-5" />
              Pedir por WhatsApp
            </CtaLink>
          </div>
          <div className="flex items-center gap-3 pt-2 animate-in fade-in duration-700 delay-500 fill-mode-both">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-honey text-honey" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">4.9 de 5</span> según más de 300 familias ayacuchanas
            </p>
          </div>
        </div>

        <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both">
          <div className="relative aspect-4/5 overflow-hidden rounded-t-full rounded-b-4xl border-8 border-card shadow-2xl shadow-primary/15 sm:aspect-square lg:aspect-4/5">
            <Image
              src="/images/hero.png"
              alt="Torta de dos pisos con buttercream rosa y fresas, rodeada de bandejas de alfajores y bocaditos"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-lg sm:left-8">
            <span
              className="flex size-10 items-center justify-center bg-honey font-serif text-sm font-bold text-honey-foreground"
              style={{ clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)' }}
              aria-hidden="true"
            >
              24h
            </span>
            <p className="text-sm leading-snug">
              <span className="block font-bold">Pedidos urgentes</span>
              <span className="text-muted-foreground">según disponibilidad</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
