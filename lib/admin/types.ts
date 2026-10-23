export type BaseEntity = {
  id: string
  createdAt: string
  updatedAt: string
}

export type EntityInput<T extends BaseEntity> = Omit<T, keyof BaseEntity>

export type AdminCategory = BaseEntity & {
  name: string
  slug: string
  description: string
  active: boolean
}

export type AdminProduct = BaseEntity & {
  name: string
  categoryId: string
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
  published: boolean
}

export type AdminFaq = BaseEntity & {
  question: string
  answer: string
  order: number
  published: boolean
}
