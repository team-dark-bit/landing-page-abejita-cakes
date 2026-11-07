import { z } from 'zod'

const imageUrl = z
  .string()
  .trim()
  .min(1, 'Agrega una imagen')
  .refine(
    (value) => /^https:\/\/\S+$/.test(value),
    'Sube la imagen desde este formulario: debe ser la URL pública del bucket',
  )

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
    .max(10000, 'El precio parece demasiado alto')
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9,
      'Usa máximo 2 decimales',
    ),
  image: imageUrl,
  featured: z.boolean(),
  active: z.boolean(),
})

// El slug lo genera el backend a partir del nombre y no se envía nunca.
export const categorySchema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres'),
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
  image: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || /^https:\/\/\S+$/.test(value),
      'Sube la foto desde este formulario o déjala vacía',
    )
    .transform((value) => (value === '' ? null : value)),
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
