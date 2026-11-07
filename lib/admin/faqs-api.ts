import type { AdminFaq, EntityInput } from './types'
import { jsonBody, requestJson } from './http'

const byOrder = (a: AdminFaq, b: AdminFaq) => a.order - b.order

const faqUrl = (id: string) => `/api/admin/faqs/${encodeURIComponent(id)}`

export async function listFaqs(): Promise<AdminFaq[]> {
  const body = (await requestJson('/api/admin/faqs')) as {
    data?: AdminFaq[] | { content?: AdminFaq[] }
  } | null
  const data = body?.data
  if (Array.isArray(data)) return [...data].sort(byOrder)
  if (data && Array.isArray(data.content)) return [...data.content].sort(byOrder)
  return []
}

export async function createFaq(input: EntityInput<AdminFaq>): Promise<AdminFaq> {
  const body = (await requestJson('/api/admin/faqs', jsonBody('POST', input))) as {
    data: AdminFaq
  }
  return body.data
}

export async function updateFaq(id: string, input: Partial<EntityInput<AdminFaq>>): Promise<AdminFaq> {
  const body = (await requestJson(faqUrl(id), jsonBody('PATCH', input))) as { data: AdminFaq }
  return body.data
}

export async function removeFaq(id: string): Promise<void> {
  await requestJson(faqUrl(id), { method: 'DELETE' })
}
