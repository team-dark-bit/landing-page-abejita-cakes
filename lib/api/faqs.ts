const API_URL = process.env.API_URL

export type Faq = {
  id: string
  question: string
  answer: string
  order: number
  published: boolean
}

type FaqListResponse = {
  data: Faq[]
}

export async function getFaqs(): Promise<Faq[]> {
  if (!API_URL) throw new Error('API_URL no definida')

  const res = await fetch(`${API_URL}/api/v1/faqs`, {
    cache: 'no-store',
    // Generous timeout to tolerate Render cold starts.
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) throw new Error(`No se pudieron obtener las preguntas frecuentes (${res.status})`)

  const { data } = (await res.json()) as FaqListResponse
  return [...data].sort((a, b) => a.order - b.order)
}
