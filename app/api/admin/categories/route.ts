import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const CATEGORIES_PATH = '/api/v1/admin/categories'

export async function GET(request: Request) {
  const { search } = new URL(request.url)
  return adminRequest(`${CATEGORIES_PATH}${search}`)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return fail(400, 'BAD_REQUEST', 'El cuerpo de la solicitud es obligatorio.')
  }

  // `slug` lo genera el backend: nunca se reenvía aunque llegue.
  return adminRequest(CATEGORIES_PATH, {
    method: 'POST',
    body: JSON.stringify({
      name: body.name,
      description: body.description,
      active: body.active,
    }),
  })
}
