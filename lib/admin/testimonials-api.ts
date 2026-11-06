import type { AdminTestimonial, EntityInput } from './types'

type ApiErrorBody = {
  error?: {
    message?: string
    details?: Record<string, string[]> | null
  }
}

function describeError(body: unknown, status: number) {
  const payload = body as ApiErrorBody | null
  const details = payload?.error?.details
  if (details) {
    const messages = Object.entries(details).flatMap(([field, list]) =>
      list.map((message) => `${field}: ${message}`),
    )
    if (messages.length > 0) return messages.join(' ')
  }
  return payload?.error?.message ?? `La operación falló (${status}).`
}

async function requestTestimonials(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(describeError(body, res.status))
  return body
}

const testimonialUrl = (id: string) => `/api/admin/testimonials/${encodeURIComponent(id)}`

/**
 * The admin filters locally, so a single page with the maximum allowed size is
 * enough. `sort` pins the order to the one shown in the table.
 */
const LIST_QUERY = '?pageSize=100&sort=-createdAt'

export async function listTestimonials(): Promise<AdminTestimonial[]> {
  const body = (await requestTestimonials(`/api/admin/testimonials${LIST_QUERY}`)) as {
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
  const body = (await requestTestimonials('/api/admin/testimonials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })) as { data: AdminTestimonial }
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
  const body = (await requestTestimonials(testimonialUrl(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })) as { data: AdminTestimonial }
  return body.data
}

export async function removeTestimonial(id: string): Promise<void> {
  await requestTestimonials(testimonialUrl(id), { method: 'DELETE' })
}
