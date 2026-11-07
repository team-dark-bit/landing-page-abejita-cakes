const API_URL = process.env.API_URL

export type PublicCategory = {
  id: string
  name: string
  slug: string
  description: string
  active: boolean
  /** Solo productos activos, según la vista pública. */
  productCount: number
}

type CategoryListResponse = {
  data: PublicCategory[]
}

export async function getCategories(): Promise<PublicCategory[]> {
  if (!API_URL) throw new Error('API_URL no definida')

  const res = await fetch(`${API_URL}/api/v1/categories`, {
    cache: 'no-store',
    // Generous timeout to tolerate Render cold starts.
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) throw new Error(`No se pudieron obtener las categorías (${res.status})`)

  const { data } = (await res.json()) as CategoryListResponse
  return data
}
