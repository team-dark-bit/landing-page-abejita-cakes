import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const FIELDS = [
  'name',
  'categoryId',
  'description',
  'size',
  'priceFrom',
  'featured',
  'active',
] as const

const upstreamUrl = (id: string) => `/api/v1/admin/products/${encodeURIComponent(id)}`

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
  // `image` es tri-estado: ausente conserva, URL reemplaza. `null` sería 422,
  // así que nunca se reenvía; el vacío equivale a ausente.
  if (typeof body.image === 'string' && body.image !== '') payload.image = body.image

  return adminRequest(upstreamUrl(id), { method: 'PATCH', body: JSON.stringify(payload) })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminRequest(upstreamUrl(id), { method: 'DELETE' })
}
