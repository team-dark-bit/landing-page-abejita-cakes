import { categories, products } from '@/lib/data'
import type { AdminCategory, AdminProduct } from './types'

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

