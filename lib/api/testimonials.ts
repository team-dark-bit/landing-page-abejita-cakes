const API_URL = process.env.API_URL

export type Testimonial = {
  id: string
  name: string
  occasion: string
  rating: number
  text: string
  image: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

type TestimonialListResponse = {
  data: Testimonial[]
}

const LANDING_LIMIT = 6

export async function getTestimonials(limit = LANDING_LIMIT): Promise<Testimonial[]> {
  if (!API_URL) throw new Error('API_URL no definida')

  const res = await fetch(`${API_URL}/api/v1/testimonials?limit=${limit}`, {
    cache: 'no-store',
    // Generous timeout to tolerate Render cold starts.
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) throw new Error(`No se pudieron obtener los testimonios (${res.status})`)

  const { data } = (await res.json()) as TestimonialListResponse
  return data
}
