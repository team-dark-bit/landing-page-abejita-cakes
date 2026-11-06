'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImageUp, Loader2, X } from 'lucide-react'
import { FormField } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { uploadImage, type UploadFolder } from '@/lib/admin/uploads-api'

type Props = {
  id: string
  label: string
  value: string | null
  onChange: (value: string | null) => void
  folder: UploadFolder
  error?: string
  hint?: string
  fallback?: React.ReactNode
  disabled?: boolean
}

export function ImageField({
  id,
  label,
  value,
  onChange,
  folder,
  error,
  hint,
  fallback,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      onChange(await uploadImage(file, folder))
    } catch (cause) {
      setUploadError(cause instanceof Error ? cause.message : 'No pudimos subir la imagen.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const message = error ?? uploadError ?? undefined

  return (
    <FormField label={label} htmlFor={id} error={message} hint={!message ? hint : undefined}>
      <div className="flex items-center gap-4">
        <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-serif text-xl font-semibold text-foreground">
          {value ? (
            <Image src={value} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            (fallback ?? <ImageUp className="size-6 text-muted-foreground" aria-hidden="true" />)
          )}
          {value && !uploading ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={disabled}
              className="absolute inset-0 flex items-center justify-center bg-foreground/60 text-primary-foreground opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100"
              aria-label="Quitar foto"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          ) : null}
        </span>

        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImageUp className="size-4" aria-hidden="true" />
            )}
            {uploading ? 'Subiendo…' : value ? 'Cambiar foto' : 'Subir foto'}
          </Button>
          <span className="text-xs text-muted-foreground">JPG, PNG o WebP · máx. 5 MB</span>
        </div>
      </div>
    </FormField>
  )
}
