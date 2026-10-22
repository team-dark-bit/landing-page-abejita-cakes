import { Clock, MapPin, Zap } from 'lucide-react'
import { CtaLink } from './cta-link'
import { WhatsappIcon } from './brand-icons'
import { SocialLinks } from './social-links'
import { business } from '@/lib/data'
import { whatsappLink } from '@/lib/whatsapp'

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid overflow-hidden rounded-4xl bg-primary text-primary-foreground lg:grid-cols-5">
          <div className="flex flex-col items-start gap-6 p-8 md:p-12 lg:col-span-3">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-honey">
              <span className="size-2 rotate-45 rounded-[2px] bg-honey" aria-hidden="true" />
              Contacto
            </p>
            <h2 id="contacto-title" className="font-serif text-3xl font-semibold leading-tight text-balance md:text-5xl">
              Tu pedido empieza con un mensaje
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/80 text-pretty">
              Cuéntanos la fecha, el número de invitados y la ocasión. Te enviamos opciones, precios y
              fotos de referencia directamente por WhatsApp.
            </p>
            <CtaLink href={whatsappLink()} size="lg" className="w-full bg-honey text-honey-foreground sm:w-auto">
              <WhatsappIcon className="size-5" />
              {`Escribir al ${business.whatsappDisplay}`}
            </CtaLink>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-primary-foreground/70">Síguenos y mira nuestros últimos pedidos</p>
              <SocialLinks tone="dark" />
            </div>
          </div>

          <dl className="flex flex-col gap-6 bg-foreground/25 p-8 md:p-12 lg:col-span-2">
            <div className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-honey" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <dt className="font-bold">Horario de atención</dt>
                {business.hours.map((h) => (
                  <dd key={h.days} className="text-primary-foreground/80">
                    {h.days}: {h.time}
                  </dd>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="mt-1 size-5 shrink-0 text-honey" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <dt className="font-bold">Tiempo de respuesta</dt>
                <dd className="leading-relaxed text-primary-foreground/80">{business.responseTime}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-honey" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <dt className="font-bold">Recojo en taller</dt>
                <dd className="leading-relaxed text-primary-foreground/80">{business.address}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
