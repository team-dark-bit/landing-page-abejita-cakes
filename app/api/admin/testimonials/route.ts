import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const TESTIMONIALS_PATH = '/api/v1/admin/testimonials'

export async function GET(request: Request) {
  const { search } = new URL(request.url)
  return adminRequest(`${TESTIMONIALS_PATH}${search}`)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return fail(400, 'BAD_REQUEST', 'El cuerpo de la solicitud es obligatorio.')
  }

  const payload: Record<string, unknown> = {
    name: body.name,
    occasion: body.occasion,
    rating: body.rating,
    text: body.text,
    published: body.published,
  }
  // `image` is optional on create: omit it when the client sends nothing.
  if (body.image !== undefined && body.image !== '') payload.image = body.image

  return adminRequest(TESTIMONIALS_PATH, { method: 'POST', body: JSON.stringify(payload) })
}
