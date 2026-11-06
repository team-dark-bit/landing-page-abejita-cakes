import { adminRequest, fail } from '@/lib/api/admin-proxy'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return fail(400, 'BAD_REQUEST', 'El cuerpo de la solicitud es obligatorio.')
  }

  const payload = {
    folder: body.folder,
    contentType: body.contentType,
    size: body.size,
  }

  return adminRequest('/api/v1/admin/uploads/sign', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
