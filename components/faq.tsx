'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeading } from './section-heading'
import { CtaLink } from './cta-link'
import { WhatsappIcon } from './brand-icons'
import { faqs } from '@/lib/data'
import { whatsappLink } from '@/lib/whatsapp'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-card/60 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-6 lg:grid-cols-5 lg:gap-16">
        <div className="flex flex-col items-start gap-6 lg:col-span-2">
          <SectionHeading
            id="faq-title"
            eyebrow="Preguntas frecuentes"
            title="Resolvemos tus dudas"
            description="Si tu pregunta no está aquí, escríbenos y te respondemos al toque."
            align="left"
          />
          <CtaLink href={whatsappLink('¡Hola Abejita Cakes! Tengo una consulta.')} variant="outline">
            <WhatsappIcon className="size-4" />
            Hacer una consulta
          </CtaLink>
        </div>

        <Accordion defaultValue={[0]} className="flex flex-col gap-3 lg:col-span-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={i}
              className="rounded-2xl border bg-card px-5 transition-shadow duration-300 not-last:border-b data-open:shadow-md"
            >
              <AccordionTrigger className="py-5 font-serif text-lg font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
