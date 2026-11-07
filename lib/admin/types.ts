export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
}

export type EntityInput<T extends BaseEntity> = Omit<T, keyof BaseEntity>

export type AdminCategory = BaseEntity & {
  name: string
  /** Solo lectura: lo genera el backend al crear y nunca cambia al renombrar. */
  slug: string
  description: string
  active: boolean
  /** Activos en la vista pública, todos en la admin. */
  productCount: number
}

export type AdminProduct = BaseEntity & {
  name: string
  categoryId: string
  /** Resuelto por el backend; el front solo lo lee. */
  category: { id: string; name: string; slug: string }
  description: string
  size: string
  priceFrom: number
  image: string
  featured: boolean
  active: boolean
}

export type AdminTestimonial = BaseEntity & {
  name: string
  occasion: string
  rating: number
  text: string
  image: string | null
  published: boolean
}

export type AdminFaq = BaseEntity & {
  question: string
  answer: string
  order: number
  published: boolean
}

/** El slug no viaja en la escritura: lo genera el backend a partir de `name`. */
export type AdminCategoryInput = {
  name: string
  description: string
  active: boolean
}

export type AdminProductInput = {
  name: string
  categoryId: string
  description: string
  size: string
  priceFrom: number
  image: string
  featured: boolean
  active: boolean
}

export type ResourceInput = {
  products: AdminProductInput
  categories: AdminCategoryInput
  testimonials: EntityInput<AdminTestimonial>
  faqs: EntityInput<AdminFaq>
}
