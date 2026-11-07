import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const PRODUCTS_PATH = '/api/v1/admin/products'

const FIELDS = [
  'name',
  'categoryId',
  'description',
  'size',
  'priceFrom',
  'image',
  'featured',
  'active',
] as const

export async function GET(request: Request) {
  const { search } = new URL(request.url)
  return adminRequest(`${PRODUCTS_PATH}${search}`)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return fail(400, 'BAD_REQUEST', 'El cuerpo de la solicitud es obligatorio.')
  }

  // Todos los campos son obligatorios en el alta: se reenvían tal cual.
  const payload: Record<string, unknown> = {}
  for (const field of FIELDS) payload[field] = body[field]

  return adminRequest(PRODUCTS_PATH, { method: 'POST', body: JSON.stringify(payload) })
}
