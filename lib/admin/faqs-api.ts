import type { AdminFaq, EntityInput } from './types'

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

async function requestFaqs(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(describeError(body, res.status))
  return body
}

const byOrder = (a: AdminFaq, b: AdminFaq) => a.order - b.order

const faqUrl = (id: string) => `/api/admin/faqs/${encodeURIComponent(id)}`

export async function listFaqs(): Promise<AdminFaq[]> {
  const body = (await requestFaqs('/api/admin/faqs')) as {
    data?: AdminFaq[] | { content?: AdminFaq[] }
  } | null
  const data = body?.data
  if (Array.isArray(data)) return [...data].sort(byOrder)
  if (data && Array.isArray(data.content)) return [...data.content].sort(byOrder)
  return []
}

export async function createFaq(input: EntityInput<AdminFaq>): Promise<AdminFaq> {
  const body = (await requestFaqs('/api/admin/faqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })) as { data: AdminFaq }
  return body.data
}

export async function updateFaq(id: string, input: Partial<EntityInput<AdminFaq>>): Promise<AdminFaq> {
  const body = (await requestFaqs(faqUrl(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })) as { data: AdminFaq }
  return body.data
}

export async function removeFaq(id: string): Promise<void> {
  await requestFaqs(faqUrl(id), { method: 'DELETE' })
}
