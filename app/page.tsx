import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Catalog } from '@/components/catalog'
import { Gallery } from '@/components/gallery'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { SiteFooter } from '@/components/site-footer'
import { WhatsappFloat } from '@/components/whatsapp-float'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
        <Gallery />
        <Testimonials />
        <Contact />
        <Faq />
      </main>
      <SiteFooter />
      <WhatsappFloat />
    </>
  )
}
