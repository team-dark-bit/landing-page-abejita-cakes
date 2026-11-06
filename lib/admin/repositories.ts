import { createLocalStorageRepository, type Repository } from './repository'
import { createFaq, listFaqs, removeFaq, updateFaq } from './faqs-api'
import {
  createTestimonial,
  listTestimonials,
  removeTestimonial,
  updateTestimonial,
} from './testimonials-api'
import { seedCategories, seedProducts } from './seed'
import type { AdminCategory, AdminFaq, AdminProduct, AdminTestimonial } from './types'

const faqRepository: Repository<AdminFaq> = {
  list: listFaqs,
  create: createFaq,
  update: updateFaq,
  remove: removeFaq,
}

const testimonialRepository: Repository<AdminTestimonial> = {
  list: listTestimonials,
  create: createTestimonial,
  update: updateTestimonial,
  remove: removeTestimonial,
}

export const repositories = {
  products: createLocalStorageRepository<AdminProduct>('products', seedProducts),
  categories: createLocalStorageRepository<AdminCategory>('categories', seedCategories),
  // Testimonios y FAQs: CRUD contra la API (a través del proxy del servidor). Sin `reset`.
  testimonials: testimonialRepository,
  faqs: faqRepository,
}

export type ResourceName = keyof typeof repositories
