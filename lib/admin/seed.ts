import { categories, products, testimonials } from '@/lib/data'
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
  published: true,
  ...stamps,
}))

export const seedFaqs: AdminFaq[] = [
  {
    id: 'faq-1',
    question: '¿Con cuánta anticipación debo pedir?',
    answer:
      'Para tortas clásicas y bocaditos, te recomendamos pedir con 2 a 3 días de anticipación. Para tortas personalizadas, mesas dulces y matrimonios, idealmente entre 1 y 2 semanas para asegurar tu fecha.',
    order: 1,
    published: true,
    ...stamps,
  },
  {
    id: 'faq-2',
    question: '¿Hacen productos sin azúcar o sin gluten?',
    answer:
      'Sí. Preparamos tortas endulzadas con stevia y algunas opciones sin gluten con harina de almendras. Trabajamos en una cocina compartida, por lo que no garantizamos ausencia total de trazas. Consúltanos por WhatsApp.',
    order: 2,
    published: true,
    ...stamps,
  },
  {
    id: 'faq-3',
    question: '¿Aceptan pedidos urgentes?',
    answer:
      'Según disponibilidad, aceptamos pedidos para el mismo día o el día siguiente de tortas clásicas y bocaditos. Escríbenos por WhatsApp y te confirmamos en minutos.',
    order: 3,
    published: true,
    ...stamps,
  },
  {
    id: 'faq-4',
    question: '¿Cómo conservar las tortas y bocaditos?',
    answer:
      'Mantén las tortas refrigeradas y sácalas 20 minutos antes de servir. Los bocaditos salados se disfrutan mejor el mismo día; si sobran, guárdalos en un recipiente hermético en refrigeración por hasta 2 días.',
    order: 4,
    published: true,
    ...stamps,
  },
  {
    id: 'faq-5',
    question: '¿Hacen delivery?',
    answer:
      'Sí, realizamos delivery en Huamanga, Carmen Alto, San Juan Bautista y Jesús Nazareno. El costo varía entre S/ 5 y S/ 10 según la zona. También puedes recoger tu pedido en nuestro taller.',
    order: 5,
    published: true,
    ...stamps,
  },
  {
    id: 'faq-6',
    question: '¿Cómo se realiza el pago?',
    answer:
      'Separamos tu pedido con el 50 % de adelanto por Yape, Plin o transferencia, y el saldo se cancela al momento de la entrega.',
    order: 6,
    published: true,
    ...stamps,
  },
]
