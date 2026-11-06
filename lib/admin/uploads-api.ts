export type UploadFolder = 'products' | 'testimonials'

type SignedUpload = {
  path: string
  uploadUrl: string
  publicUrl: string
  expiresIn: number
}

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type ApiErrorBody = {
  error?: {
    message?: string
    details?: Record<string, string[]> | null
  }
}

function describeError(body: unknown, fallback: string) {
  const payload = body as ApiErrorBody | null
  const details = payload?.error?.details
  if (details) {
    const messages = Object.values(details).flat()
    if (messages.length > 0) return messages.join(' ')
  }
  return payload?.error?.message ?? fallback
}

/**
 * Signs an upload, PUTs the file straight to Supabase Storage and returns the
 * public URL to store on the record. Every attempt requests a new signature:
 * a signed URL only accepts a single upload.
 */
export async function uploadImage(file: File, folder: UploadFolder): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato no permitido. Usa JPG, PNG o WebP.')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('La imagen supera los 5 MB.')
  }

  const signRes = await fetch('/api/admin/uploads/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ folder, contentType: file.type, size: file.size }),
  })
  const signBody = (await signRes.json().catch(() => null)) as
    | { data?: SignedUpload }
    | ApiErrorBody
    | null

  const signed = signBody && 'data' in signBody ? signBody.data : undefined
  if (!signRes.ok || !signed) {
    throw new Error(describeError(signBody, 'No pudimos preparar la subida de la imagen.'))
  }

  const { uploadUrl, publicUrl } = signed

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (!uploadRes.ok) {
    throw new Error('No pudimos subir la imagen. Intenta de nuevo.')
  }

  return publicUrl
}
