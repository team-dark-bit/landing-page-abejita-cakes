import type { AdminTestimonial, EntityInput } from './types'
import { jsonBody, requestJson } from './http'

const testimonialUrl = (id: string) => `/api/admin/testimonials/${encodeURIComponent(id)}`

/**
 * The admin filters locally, so a single page with the maximum allowed size is
 * enough. `sort` pins the order to the one shown in the table.
 */
const LIST_QUERY = '?pageSize=100&sort=-createdAt'

export async function listTestimonials(): Promise<AdminTestimonial[]> {
  const body = (await requestJson(`/api/admin/testimonials${LIST_QUERY}`)) as {
    data?: AdminTestimonial[] | { content?: AdminTestimonial[] }
  } | null
  const data = body?.data
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  return []
}

export async function createTestimonial(
  input: EntityInput<AdminTestimonial>,
): Promise<AdminTestimonial> {
  const body = (await requestJson('/api/admin/testimonials', jsonBody('POST', input))) as {
    data: AdminTestimonial
  }
  return body.data
}

/**
 * `image` follows the API's three-state rule: key omitted keeps the current
 * photo, `null` removes it, and a public URL replaces it.
 */
export async function updateTestimonial(
  id: string,
  input: Partial<EntityInput<AdminTestimonial>>,
): Promise<AdminTestimonial> {
  const body = (await requestJson(testimonialUrl(id), jsonBody('PATCH', input))) as {
    data: AdminTestimonial
  }
  return body.data
}

export async function removeTestimonial(id: string): Promise<void> {
  await requestJson(testimonialUrl(id), { method: 'DELETE' })
}
