import { z } from 'zod'

const isImagePath = (value: string) => value.startsWith('/') || /^https:\/\/\S+$/.test(value)
const imagePathMessage = 'Usa una ruta local (/images/...) o una URL https://'

const imagePath = z.string().trim().min(1, 'Agrega una imagen').refine(isImagePath, imagePathMessage)

const optionalImagePath = z
  .string()
  .trim()
  .refine((value) => value === '' || isImagePath(value), imagePathMessage)

export const productSchema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres').max(80, 'Máximo 80 caracteres'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  description: z
    .string()
    .trim()
    .min(10, 'Describe el producto en al menos 10 caracteres')
    .max(240, 'Máximo 240 caracteres'),
  size: z.string().trim().min(2, 'Indica el tamaño o porciones').max(60, 'Máximo 60 caracteres'),
  priceFrom: z.coerce
    .number({ error: 'Ingresa un precio válido' })
    .positive('El precio debe ser mayor a 0')
    .max(10000, 'El precio parece demasiado alto'),
  image: imagePath,
  featured: z.boolean(),
  active: z.boolean(),
})

export const categorySchema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres'),
  slug: z
    .string()
    .trim()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones'),
  description: z.string().trim().max(160, 'Máximo 160 caracteres'),
  active: z.boolean(),
})

export const testimonialSchema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres').max(60, 'Máximo 60 caracteres'),
  occasion: z.string().trim().min(3, 'Indica la ocasión').max(60, 'Máximo 60 caracteres'),
  rating: z.coerce
    .number({ error: 'Selecciona una calificación' })
    .int()
    .min(1, 'Mínimo 1 estrella')
    .max(5, 'Máximo 5 estrellas'),
  text: z.string().trim().min(20, 'Mínimo 20 caracteres').max(400, 'Máximo 400 caracteres'),
  image: optionalImagePath,
  published: z.boolean(),
})

export const faqSchema = z.object({
  question: z
    .string()
    .trim()
    .min(8, 'Mínimo 8 caracteres')
    .max(140, 'Máximo 140 caracteres'),
  answer: z.string().trim().min(20, 'Mínimo 20 caracteres').max(600, 'Máximo 600 caracteres'),
  order: z.coerce
    .number({ error: 'Ingresa un número' })
    .int('Debe ser un número entero')
    .min(1, 'Mínimo 1')
    .max(999, 'Máximo 999'),
  published: z.boolean(),
})

export const loginSchema = z.object({
  email: z.email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
