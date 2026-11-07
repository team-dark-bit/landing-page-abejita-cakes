import type { AdminProduct, AdminProductInput } from './types'
import { jsonBody, requestJson } from './http'

/**
 * La UI filtra en cliente, así que basta una página con el tamaño máximo.
 * El orden coincide con el que se muestra en la tabla.
 */
const LIST_QUERY = '?pageSize=100&sort=-updatedAt'

const productUrl = (id: string) => `/api/admin/products/${encodeURIComponent(id)}`

export async function listProducts(): Promise<AdminProduct[]> {
  const body = (await requestJson(`/api/admin/products${LIST_QUERY}`)) as {
    data?: AdminProduct[] | { content?: AdminProduct[] }
  } | null
  const data = body?.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  return []
}

export async function createProduct(input: AdminProductInput): Promise<AdminProduct> {
  const body = (await requestJson('/api/admin/products', jsonBody('POST', input))) as {
    data: AdminProduct
  }
  return body.data
}

export async function updateProduct(
  id: string,
  input: Partial<AdminProductInput>,
): Promise<AdminProduct> {
  const body = (await requestJson(productUrl(id), jsonBody('PATCH', input))) as {
    data: AdminProduct
  }
  return body.data
}

export async function removeProduct(id: string): Promise<void> {
  await requestJson(productUrl(id), { method: 'DELETE' })
}
