import { SiteHeader } from '@/components/site-header'
import { getFaqs } from '@/lib/api/faqs'
import { getTestimonials } from '@/lib/api/testimonials'
import { Hero } from '@/components/hero'
import { Catalog } from '@/components/catalog'
import { Gallery } from '@/components/gallery'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { SiteFooter } from '@/components/site-footer'
import { WhatsappFloat } from '@/components/whatsapp-float'

// FAQ and testimonial data is fetched live from the API on every request (no cache).
export const dynamic = 'force-dynamic'

export default async function Page() {
  const [faqs, testimonials] = await Promise.all([
    getFaqs().catch((error) => {
      console.error(error)
      return []
    }),
    getTestimonials().catch((error) => {
      console.error(error)
      return []
    }),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
        <Gallery />
        <Testimonials items={testimonials} />
        <Contact />
        <Faq items={faqs} />
      </main>
      <SiteFooter />
      <WhatsappFloat />
    </>
  )
}
