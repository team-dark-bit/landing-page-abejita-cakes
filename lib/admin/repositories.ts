import { createLocalStorageRepository, type Repository } from './repository'
import { createFaq, listFaqs, removeFaq, updateFaq } from './faqs-api'
import { seedCategories, seedProducts, seedTestimonials } from './seed'
import type { AdminCategory, AdminFaq, AdminProduct, AdminTestimonial } from './types'

const faqRepository: Repository<AdminFaq> = {
  list: listFaqs,
  create: createFaq,
  update: updateFaq,
  remove: removeFaq,
}

export const repositories = {
  products: createLocalStorageRepository<AdminProduct>('products', seedProducts),
  categories: createLocalStorageRepository<AdminCategory>('categories', seedCategories),
  testimonials: createLocalStorageRepository<AdminTestimonial>('testimonials', seedTestimonials),
  // FAQs: CRUD contra la API (a través del proxy del servidor). Sin `reset`: no hay datos locales.
  faqs: faqRepository,
}

export type ResourceName = keyof typeof repositories
