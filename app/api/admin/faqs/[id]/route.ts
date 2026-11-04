import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const FIELDS = ['question', 'answer', 'order', 'published'] as const

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return fail(400, 'BAD_REQUEST', 'El cuerpo de la solicitud es obligatorio.')
  }

  const payload: Record<string, unknown> = {}
  for (const field of FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field]
  }

  return adminRequest(`/api/v1/admin/faqs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminRequest(`/api/v1/admin/faqs/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
