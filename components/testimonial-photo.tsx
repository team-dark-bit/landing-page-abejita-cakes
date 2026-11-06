'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

type Props = {
  name: string
  occasion: string
  image: string | null
}

/**
 * Avatar de la reseña. Con foto se amplía al pasar el mouse o al enfocar con
 * Tab, y al tocarla abre la imagen a tamaño completo (útil en móvil, donde no
 * hay hover). Sin foto —o si la URL falla— se muestra la inicial del nombre.
 */
export function TestimonialPhoto({ name, occasion, image }: Props) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  if (!image || failed) {
    return (
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary font-serif font-semibold"
        aria-hidden="true"
      >
        {initial}
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar la foto de ${name}`}
        className="group relative size-10 shrink-0 touch-manipulation rounded-full focus-visible:outline-none"
      >
        <span className="relative flex size-10 overflow-hidden rounded-full bg-secondary ring-1 ring-border/60 transition-[transform,box-shadow] duration-300 group-hover:scale-125 group-hover:shadow-md group-focus-visible:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-ring motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100">
          <Image
            src={image}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        </span>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-foreground/55 text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="size-4" aria-hidden="true" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-1.5rem)] gap-3 bg-card p-3 sm:max-w-sm">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={image}
              alt={`Foto de ${name}`}
              fill
              sizes="(min-width: 640px) 24rem, 90vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-0.5 px-1 pb-1">
            <DialogTitle className="font-serif text-lg font-semibold">{name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">{occasion}</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
