const API_URL = process.env.API_URL

/**
 * Vista pública: el backend ya filtra productos y categorías activas, y
 * devuelve `category` resuelto para no necesitar la lista de categorías.
 */
export type PublicProduct = {
  id: string
  name: string
  category: { slug: string; name: string }
  description: string
  size: string
  priceFrom: number
  image: string
  featured: boolean
}

type ProductListResponse = {
  data: PublicProduct[]
}

export async function getProducts(): Promise<PublicProduct[]> {
  if (!API_URL) throw new Error('API_URL no definida')

  const res = await fetch(`${API_URL}/api/v1/products`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) throw new Error(`No se pudieron obtener los productos (${res.status})`)

  const { data } = (await res.json()) as ProductListResponse
  return data
}
