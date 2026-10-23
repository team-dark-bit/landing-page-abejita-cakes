'use client'

import { useMemo, useState } from 'react'
import { MessageSquareQuote, Pencil, Plus, SearchX, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from '@/components/admin/form-field'
import {
  ConfirmDeleteDialog,
  EmptyState,
  ErrorState,
  PageHeader,
  ResourceCard,
  StatusPill,
  SubmitButton,
  SwitchRow,
  TableSkeleton,
  Toolbar,
  errorMessage,
} from '@/components/admin/resource-ui'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { useResource } from '@/hooks/use-resource'
import { useZodForm } from '@/hooks/use-zod-form'
import { testimonialSchema } from '@/lib/admin/schemas'
import type { AdminTestimonial, EntityInput } from '@/lib/admin/types'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'published' | 'hidden'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('size-3.5', i < rating ? 'fill-honey text-honey' : 'text-border')}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export function TestimonialsManager() {
  const testimonials = useResource('testimonials')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [rating, setRating] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminTestimonial | null>(null)
  const [deleting, setDeleting] = useState<AdminTestimonial | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return testimonials.items
      .filter((t) => (status === 'all' ? true : status === 'published' ? t.published : !t.published))
      .filter((t) => (rating === 'all' ? true : t.rating === Number(rating)))
      .filter((t) => !term || `${t.name} ${t.occasion} ${t.text}`.toLowerCase().includes(term))
  }, [testimonials.items, search, status, rating])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  async function handleSubmit(input: EntityInput<AdminTestimonial>) {
    try {
      if (editing) {
        await testimonials.update(editing.id, input)
        toast.success('Testimonio actualizado', { description: input.name })
      } else {
        await testimonials.create(input)
        toast.success('Testimonio creado', { description: input.name })
      }
      setFormOpen(false)
    } catch (error) {
      toast.error('No se pudo guardar el testimonio', { description: errorMessage(error) })
    }
  }

  async function togglePublished(item: AdminTestimonial, published: boolean) {
    try {
      await testimonials.update(item.id, { published })
      toast.success(published ? 'Testimonio publicado' : 'Testimonio oculto', { description: item.name })
    } catch (error) {
      toast.error('No se pudo cambiar el estado', { description: errorMessage(error) })
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await testimonials.remove(deleting.id)
      toast.success('Testimonio eliminado', { description: deleting.name })
    } catch (error) {
      toast.error('No se pudo eliminar', { description: errorMessage(error) })
    }
  }

  return (
    <>
      <PageHeader
        title="Testimonios"
        description="Reseñas de clientes que se muestran en la página de inicio."
        action={
          <Button onClick={openCreate} className="rounded-full" size="lg">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo testimonio
          </Button>
        }
      />

      <ResourceCard>
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Buscar por cliente, ocasión o texto"
          resultLabel={
            testimonials.isLoading ? 'Cargando…' : `${filtered.length} de ${testimonials.items.length} testimonios`
          }
          hasActiveFilters={search !== '' || status !== 'all' || rating !== 'all'}
          onClear={() => {
            setSearch('')
            setStatus('all')
            setRating('all')
          }}
        >
          <NativeSelect
            aria-label="Filtrar por calificación"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="[&_select]:h-10"
          >
            <option value="all">Todas las calificaciones</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'estrella' : 'estrellas'}
              </option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="[&_select]:h-10"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="hidden">Ocultos</option>
          </NativeSelect>
        </Toolbar>

        {testimonials.error ? (
          <ErrorState message={testimonials.error.message} onRetry={testimonials.reload} />
        ) : testimonials.isLoading ? (
          <TableSkeleton />
        ) : testimonials.items.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title="Aún no hay testimonios"
            description="Agrega reseñas de tus clientes para generar confianza en el sitio."
            action={
              <Button onClick={openCreate} className="rounded-full">
                <Plus className="size-4" aria-hidden="true" />
                Agregar testimonio
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={SearchX} title="Sin resultados" description="Ningún testimonio coincide con los filtros." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Cliente</TableHead>
                <TableHead>Testimonio</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead className="pr-4 text-right">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4">
                    <div className="flex min-w-40 flex-col">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.occasion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-2 min-w-64 max-w-md whitespace-normal text-muted-foreground">
                      {item.text}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Stars rating={item.rating} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.published}
                        onCheckedChange={(v) => togglePublished(item, v)}
                        aria-label={`${item.published ? 'Ocultar' : 'Publicar'} testimonio de ${item.name}`}
                      />
                      <StatusPill on={item.published} onLabel="Visible" offLabel="Oculto" />
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar testimonio de ${item.name}`}
                        onClick={() => {
                          setEditing(item)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar testimonio de ${item.name}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleting(item)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ResourceCard>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? 'Editar testimonio' : 'Nuevo testimonio'}</DialogTitle>
            <DialogDescription>Usa el nombre que el cliente autorizó publicar.</DialogDescription>
          </DialogHeader>
          {formOpen && <TestimonialForm key={editing?.id ?? 'new'} testimonial={editing} onSubmit={handleSubmit} />}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar este testimonio?"
        description={`El testimonio de ${deleting?.name ?? ''} se eliminará permanentemente.`}
        onConfirm={handleDelete}
      />
    </>
  )
}

function TestimonialForm({
  testimonial,
  onSubmit,
}: {
  testimonial: AdminTestimonial | null
  onSubmit: (input: EntityInput<AdminTestimonial>) => Promise<void>
}) {
  const [pending, setPending] = useState(false)
  const { values, errors, setField, validate } = useZodForm(testimonialSchema, {
    name: testimonial?.name ?? '',
    occasion: testimonial?.occasion ?? '',
    rating: testimonial ? String(testimonial.rating) : '5',
    text: testimonial?.text ?? '',
    published: testimonial?.published ?? true,
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

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre del cliente" htmlFor="t-name" error={errors.name}>
          <Input
            id="t-name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            className="h-10"
            onChange={(e) => setField('name', e.target.value)}
          />
        </FormField>
        <FormField label="Ocasión" htmlFor="t-occasion" error={errors.occasion}>
          <Input
            id="t-occasion"
            value={values.occasion}
            placeholder="Cumpleaños, boda…"
            aria-invalid={Boolean(errors.occasion)}
            className="h-10"
            onChange={(e) => setField('occasion', e.target.value)}
          />
        </FormField>
      </div>
      <FormField label="Calificación" htmlFor="t-rating" error={errors.rating}>
        <NativeSelect
          id="t-rating"
          value={values.rating}
          onChange={(e) => setField('rating', e.target.value)}
          className="w-full [&_select]:h-10"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'estrella' : 'estrellas'}
            </option>
          ))}
        </NativeSelect>
      </FormField>
      <FormField
        label="Testimonio"
        htmlFor="t-text"
        error={errors.text}
        hint={`${values.text.length}/400 caracteres`}
      >
        <Textarea
          id="t-text"
          rows={4}
          value={values.text}
          aria-invalid={Boolean(errors.text)}
          onChange={(e) => setField('text', e.target.value)}
        />
      </FormField>
      <SwitchRow id="t-published" label="Publicado" description="Visible en la página de inicio">
        <Switch id="t-published" checked={values.published} onCheckedChange={(v) => setField('published', v)} />
      </SwitchRow>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
        <SubmitButton pending={pending} label={testimonial ? 'Guardar cambios' : 'Crear testimonio'} />
      </DialogFooter>
    </form>
  )
}
