import { SiteHeader } from '@/components/site-header'
import { getCategories } from '@/lib/api/categories'
import { getFaqs } from '@/lib/api/faqs'
import { getProducts } from '@/lib/api/products'
import { getTestimonials } from '@/lib/api/testimonials'
import { Hero } from '@/components/hero'
import { Catalog } from '@/components/catalog'
import { Gallery } from '@/components/gallery'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { SiteFooter } from '@/components/site-footer'
import { WhatsappFloat } from '@/components/whatsapp-float'

// Catalog, testimonial and FAQ data is fetched live from the API on every request (no cache).
export const dynamic = 'force-dynamic'

const empty = () => []

export default async function Page() {
  const [faqs, testimonials, categories, products] = await Promise.all([
    getFaqs().catch((error) => {
      console.error(error)
      return empty()
    }),
    getTestimonials().catch((error) => {
      console.error(error)
      return empty()
    }),
    getCategories().catch((error) => {
      console.error(error)
      return empty()
    }),
    getProducts().catch((error) => {
      console.error(error)
      return empty()
    }),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Catalog products={products} categories={categories} />
        <Gallery />
        <Testimonials items={testimonials} />
        <Contact />
        <Faq items={faqs} />
      </main>
      <SiteFooter categories={categories} />
      <WhatsappFloat />
    </>
  )
}
