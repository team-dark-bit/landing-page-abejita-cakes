import type { AdminCategory, AdminCategoryInput } from './types'
import { jsonBody, requestJson } from './http'

/**
 * Una sola página con el tamaño máximo: el panel filtra en cliente y necesita
 * ver también las categorías inactivas (`status=all` es el default de la API).
 */
const LIST_QUERY = '?pageSize=100&sort=name'

const categoryUrl = (id: string) => `/api/admin/categories/${encodeURIComponent(id)}`

export async function listCategories(): Promise<AdminCategory[]> {
  const body = (await requestJson(`/api/admin/categories${LIST_QUERY}`)) as {
    data?: AdminCategory[] | { content?: AdminCategory[] }
  } | null
  const data = body?.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  return []
}

export async function createCategory(input: AdminCategoryInput): Promise<AdminCategory> {
  const body = (await requestJson('/api/admin/categories', jsonBody('POST', input))) as {
    data: AdminCategory
  }
  return body.data
}

export async function updateCategory(
  id: string,
  input: Partial<AdminCategoryInput>,
): Promise<AdminCategory> {
  const body = (await requestJson(categoryUrl(id), jsonBody('PATCH', input))) as {
    data: AdminCategory
  }
  return body.data
}

export async function removeCategory(id: string): Promise<void> {
  await requestJson(categoryUrl(id), { method: 'DELETE' })
}
