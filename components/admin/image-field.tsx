'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { FormField } from '@/components/admin/form-field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  suggestions?: string[]
  previewAlt: string
  fallback?: React.ReactNode
  shape?: 'rounded' | 'circle'
  className?: string
}

export function ImageField({
  id,
  label,
  value,
  onChange,
  error,
  hint = 'Ruta local (/images/...) o URL https://',
  suggestions = [],
  previewAlt,
  fallback,
  shape = 'rounded',
  className,
}: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showPreview = value.trim() !== '' && failedSrc !== value
  const listId = suggestions.length > 0 ? `${id}-suggestions` : undefined

  return (
    <div className={cn('flex gap-4', className)}>
      <div
        className={cn(
          'flex size-20 shrink-0 items-center justify-center overflow-hidden border bg-muted',
          shape === 'circle' ? 'rounded-full' : 'rounded-xl',
        )}
      >
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={previewAlt} className="size-full object-cover" onError={() => setFailedSrc(value)} />
        ) : (
          (fallback ?? <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />)
        )}
      </div>
      <FormField label={label} htmlFor={id} error={error} hint={hint} className="flex-1">
        <Input
          id={id}
          list={listId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {listId && (
          <datalist id={listId}>
            {suggestions.map((src) => (
              <option key={src} value={src} />
            ))}
          </datalist>
        )}
        {value !== '' && failedSrc === value && !error && (
          <p className="text-xs text-destructive">No se pudo cargar la imagen. Revisa la ruta.</p>
        )}
      </FormField>
    </div>
  )
}
