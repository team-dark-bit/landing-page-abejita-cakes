import { createLocalStorageRepository } from './repository'
import { seedCategories, seedFaqs, seedProducts, seedTestimonials } from './seed'
import type { AdminCategory, AdminFaq, AdminProduct, AdminTestimonial } from './types'

export const repositories = {
  products: createLocalStorageRepository<AdminProduct>('products', seedProducts),
  categories: createLocalStorageRepository<AdminCategory>('categories', seedCategories),
  testimonials: createLocalStorageRepository<AdminTestimonial>('testimonials', seedTestimonials),
  faqs: createLocalStorageRepository<AdminFaq>('faqs', seedFaqs),
}

export type ResourceName = keyof typeof repositories
