import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const FIELDS = ['name', 'occasion', 'rating', 'text', 'published'] as const

const upstreamUrl = (id: string) => `/api/v1/admin/testimonials/${encodeURIComponent(id)}`

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminRequest(upstreamUrl(id))
}

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
  // Keep the three image states: absent = keep, null = remove, URL = replace.
  // An empty string means "unchanged" per the API contract, so it is not forwarded.
  if (body.image !== undefined && body.image !== '') payload.image = body.image

  return adminRequest(upstreamUrl(id), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminRequest(upstreamUrl(id), { method: 'DELETE' })
}
