import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

const FAQS_PATH = '/api/v1/admin/faqs'

export async function GET() {
  return adminRequest(FAQS_PATH)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return fail(400, 'BAD_REQUEST', 'El cuerpo de la solicitud es obligatorio.')
  }

  const payload = {
    question: body.question,
    answer: body.answer,
    order: body.order,
    published: body.published,
  }

  return adminRequest(FAQS_PATH, { method: 'POST', body: JSON.stringify(payload) })
}
