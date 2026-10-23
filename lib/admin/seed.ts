import { categories, faqs, products, testimonials } from '@/lib/data'
import type { AdminCategory, AdminFaq, AdminProduct, AdminTestimonial } from './types'

const seededAt = '2026-10-01T12:00:00.000Z'
const stamps = { createdAt: seededAt, updatedAt: seededAt }

export const seedCategories: AdminCategory[] = categories.map((category) => ({
  id: category.id,
  name: category.label,
  slug: category.id,
  description: '',
  active: true,
  ...stamps,
}))

export const seedProducts: AdminProduct[] = products.map((product) => ({
  id: product.id,
  name: product.name,
  categoryId: product.category,
  description: product.description,
  size: product.size,
  priceFrom: product.priceFrom,
  image: product.image,
  featured: Boolean(product.tag),
  active: true,
  ...stamps,
}))

export const seedTestimonials: AdminTestimonial[] = testimonials.map((testimonial, index) => ({
  id: `testimonio-${index + 1}`,
  ...testimonial,
  image: '',
  published: true,
  ...stamps,
}))

export const seedFaqs: AdminFaq[] = faqs.map((faq, index) => ({
  id: `faq-${index + 1}`,
  question: faq.q,
  answer: faq.a,
  order: index + 1,
  published: true,
  ...stamps,
}))
