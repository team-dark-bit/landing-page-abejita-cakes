'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { FormField } from '@/components/admin/form-field'
import { SubmitButton, SwitchRow } from '@/components/admin/resource-ui'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useZodForm } from '@/hooks/use-zod-form'
import { productSchema } from '@/lib/admin/schemas'
import type { AdminCategory, AdminProduct, EntityInput } from '@/lib/admin/types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: AdminProduct | null
  categories: AdminCategory[]
  imageSuggestions: string[]
  onSubmit: (input: EntityInput<AdminProduct>) => Promise<void>
}

export function ProductFormDialog({ open, onOpenChange, product, ...rest }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{product ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          <DialogDescription>
            Los campos marcados con validación se revisan antes de guardar.
          </DialogDescription>
        </DialogHeader>
        {open && <ProductForm key={product?.id ?? 'new'} product={product} {...rest} />}
      </DialogContent>
    </Dialog>
  )
}

function ProductForm({
  product,
  categories,
  imageSuggestions,
  onSubmit,
}: Omit<Props, 'open' | 'onOpenChange'>) {
  const [pending, setPending] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const { values, errors, setField, validate } = useZodForm(productSchema, {
    name: product?.name ?? '',
    categoryId: product?.categoryId ?? '',
    description: product?.description ?? '',
    size: product?.size ?? '',
    priceFrom: product ? String(product.priceFrom) : '',
    image: product?.image ?? '',
    featured: product?.featured ?? false,
    active: product?.active ?? true,
  })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const data = validate()
    if (!data) return
    setPending(true)
    try {
      await onSubmit(data)
    } finally {
      setPending(false)
    }
  }

  const invalid = (field: keyof typeof errors) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre" htmlFor="name" error={errors.name} className="sm:col-span-2">
          <Input
            id="name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            className="h-10"
            {...invalid('name')}
          />
        </FormField>

        <FormField label="Categoría" htmlFor="categoryId" error={errors.categoryId}>
          <NativeSelect
            id="categoryId"
            value={values.categoryId}
            onChange={(e) => setField('categoryId', e.target.value)}
            className="w-full [&_select]:h-10"
            {...invalid('categoryId')}
          >
            <option value="">Selecciona…</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.active ? '' : ' (inactiva)'}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField label="Precio desde (S/)" htmlFor="priceFrom" error={errors.priceFrom}>
          <Input
            id="priceFrom"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={values.priceFrom}
            onChange={(e) => setField('priceFrom', e.target.value)}
            className="h-10"
            {...invalid('priceFrom')}
          />
        </FormField>

        <FormField
          label="Tamaño / porciones"
          htmlFor="size"
          error={errors.size}
          hint="Ej. 20 a 25 porciones, Ciento (100 unid.)"
          className="sm:col-span-2"
        >
          <Input
            id="size"
            value={values.size}
            onChange={(e) => setField('size', e.target.value)}
            className="h-10"
            {...invalid('size')}
          />
        </FormField>

        <FormField
          label="Descripción"
          htmlFor="description"
          error={errors.description}
          hint={`${values.description.length}/240 caracteres`}
          className="sm:col-span-2"
        >
          <Textarea
            id="description"
            rows={3}
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
            {...invalid('description')}
          />
        </FormField>

        <div className="flex gap-4 sm:col-span-2">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {values.image && !previewFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={values.image}
                alt="Vista previa del producto"
                className="size-full object-cover"
                onError={() => setPreviewFailed(true)}
              />
            ) : (
              <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <FormField
            label="Imagen"
            htmlFor="image"
            error={errors.image}
            hint="Ruta local (/images/products/...) o URL https://"
            className="flex-1"
          >
            <Input
              id="image"
              list="image-suggestions"
              value={values.image}
              onChange={(e) => {
                setPreviewFailed(false)
                setField('image', e.target.value)
              }}
              className="h-10"
              {...invalid('image')}
            />
            <datalist id="image-suggestions">
              {imageSuggestions.map((src) => (
                <option key={src} value={src} />
              ))}
            </datalist>
          </FormField>
        </div>

        <SwitchRow id="featured" label="Destacado" description="Aparece primero en el catálogo">
          <Switch id="featured" checked={values.featured} onCheckedChange={(v) => setField('featured', v)} />
        </SwitchRow>
        <SwitchRow id="active" label="Activo" description="Visible en el sitio público">
          <Switch id="active" checked={values.active} onCheckedChange={(v) => setField('active', v)} />
        </SwitchRow>
      </div>

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
        <SubmitButton pending={pending} label={product ? 'Guardar cambios' : 'Crear producto'} />
      </DialogFooter>
    </form>
  )
}
