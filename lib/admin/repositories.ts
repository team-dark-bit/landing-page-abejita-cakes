import type { Repository } from './repository'
import { createFaq, listFaqs, removeFaq, updateFaq } from './faqs-api'
import {
  createTestimonial,
  listTestimonials,
  removeTestimonial,
  updateTestimonial,
} from './testimonials-api'
import { createCategory, listCategories, removeCategory, updateCategory } from './categories-api'
import { createProduct, listProducts, removeProduct, updateProduct } from './products-api'
import type {
  AdminCategory,
  AdminCategoryInput,
  AdminFaq,
  AdminProduct,
  AdminProductInput,
  AdminTestimonial,
  EntityInput,
} from './types'

// Todos los recursos viven en la API; el navegador solo habla con el proxy del
// mismo origen (`/api/admin/**`), que adjunta el token de Supabase.

const productRepository: Repository<AdminProduct, AdminProductInput> = {
  list: listProducts,
  create: createProduct,
  update: updateProduct,
  remove: removeProduct,
}

const categoryRepository: Repository<AdminCategory, AdminCategoryInput> = {
  list: listCategories,
  create: createCategory,
  update: updateCategory,
  remove: removeCategory,
}

const testimonialRepository: Repository<AdminTestimonial, EntityInput<AdminTestimonial>> = {
  list: listTestimonials,
  create: createTestimonial,
  update: updateTestimonial,
  remove: removeTestimonial,
}

const faqRepository: Repository<AdminFaq, EntityInput<AdminFaq>> = {
  list: listFaqs,
  create: createFaq,
  update: updateFaq,
  remove: removeFaq,
}

export const repositories = {
  products: productRepository,
  categories: categoryRepository,
  testimonials: testimonialRepository,
  faqs: faqRepository,
}

export type ResourceName = keyof typeof repositories
