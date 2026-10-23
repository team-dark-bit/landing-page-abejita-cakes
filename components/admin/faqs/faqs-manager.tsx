'use client'

import { useMemo, useState } from 'react'
import { MessageCircleQuestion, Pencil, Plus, SearchX, Trash2 } from 'lucide-react'
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
import { faqSchema } from '@/lib/admin/schemas'
import type { AdminFaq, EntityInput } from '@/lib/admin/types'

type StatusFilter = 'all' | 'published' | 'hidden'

export function FaqsManager() {
  const faqs = useResource('faqs')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminFaq | null>(null)
  const [deleting, setDeleting] = useState<AdminFaq | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...faqs.items]
      .sort((a, b) => a.order - b.order)
      .filter((f) => (status === 'all' ? true : status === 'published' ? f.published : !f.published))
      .filter((f) => !term || `${f.question} ${f.answer}`.toLowerCase().includes(term))
  }, [faqs.items, search, status])

  const nextOrder = faqs.items.reduce((max, f) => Math.max(max, f.order), 0) + 1

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  async function handleSubmit(input: EntityInput<AdminFaq>) {
    try {
      if (editing) {
        await faqs.update(editing.id, input)
        toast.success('Pregunta actualizada')
      } else {
        await faqs.create(input)
        toast.success('Pregunta creada')
      }
      setFormOpen(false)
    } catch (error) {
      toast.error('No se pudo guardar la pregunta', { description: errorMessage(error) })
    }
  }

  async function togglePublished(item: AdminFaq, published: boolean) {
    try {
      await faqs.update(item.id, { published })
      toast.success(published ? 'Pregunta publicada' : 'Pregunta oculta')
    } catch (error) {
      toast.error('No se pudo cambiar el estado', { description: errorMessage(error) })
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await faqs.remove(deleting.id)
      toast.success('Pregunta eliminada')
    } catch (error) {
      toast.error('No se pudo eliminar', { description: errorMessage(error) })
    }
  }

  return (
    <>
      <PageHeader
        title="Preguntas frecuentes"
        description="Resuelve dudas antes de que lleguen a WhatsApp. El orden define cómo se muestran."
        action={
          <Button onClick={openCreate} className="rounded-full" size="lg">
            <Plus className="size-4" aria-hidden="true" />
            Nueva pregunta
          </Button>
        }
      />

      <ResourceCard>
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Buscar en preguntas y respuestas"
          resultLabel={faqs.isLoading ? 'Cargando…' : `${filtered.length} de ${faqs.items.length} preguntas`}
          hasActiveFilters={search !== '' || status !== 'all'}
          onClear={() => {
            setSearch('')
            setStatus('all')
          }}
        >
          <NativeSelect
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="[&_select]:h-10"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicadas</option>
            <option value="hidden">Ocultas</option>
          </NativeSelect>
        </Toolbar>

        {faqs.error ? (
          <ErrorState message={faqs.error.message} onRetry={faqs.reload} />
        ) : faqs.isLoading ? (
          <TableSkeleton />
        ) : faqs.items.length === 0 ? (
          <EmptyState
            icon={MessageCircleQuestion}
            title="Aún no hay preguntas"
            description="Agrega las dudas más comunes de tus clientes."
            action={
              <Button onClick={openCreate} className="rounded-full">
                <Plus className="size-4" aria-hidden="true" />
                Agregar pregunta
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={SearchX} title="Sin resultados" description="Ninguna pregunta coincide con los filtros." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 pl-4">Orden</TableHead>
                <TableHead>Pregunta</TableHead>
                <TableHead>Publicada</TableHead>
                <TableHead className="pr-4 text-right">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-4 font-semibold tabular-nums text-muted-foreground">{item.order}</TableCell>
                  <TableCell>
                    <div className="flex min-w-72 max-w-xl flex-col gap-0.5 whitespace-normal">
                      <span className="font-semibold">{item.question}</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">{item.answer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.published}
                        onCheckedChange={(v) => togglePublished(item, v)}
                        aria-label={`${item.published ? 'Ocultar' : 'Publicar'}: ${item.question}`}
                      />
                      <StatusPill on={item.published} onLabel="Visible" offLabel="Oculta" />
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar: ${item.question}`}
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
                        aria-label={`Eliminar: ${item.question}`}
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
            <DialogTitle className="font-serif text-xl">{editing ? 'Editar pregunta' : 'Nueva pregunta'}</DialogTitle>
            <DialogDescription>Escribe la pregunta tal como la haría un cliente.</DialogDescription>
          </DialogHeader>
          {formOpen && (
            <FaqForm key={editing?.id ?? 'new'} faq={editing} defaultOrder={nextOrder} onSubmit={handleSubmit} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar esta pregunta?"
        description={`"${deleting?.question ?? ''}" se eliminará permanentemente.`}
        onConfirm={handleDelete}
      />
    </>
  )
}

function FaqForm({
  faq,
  defaultOrder,
  onSubmit,
}: {
  faq: AdminFaq | null
  defaultOrder: number
  onSubmit: (input: EntityInput<AdminFaq>) => Promise<void>
}) {
  const [pending, setPending] = useState(false)
  const { values, errors, setField, validate } = useZodForm(faqSchema, {
    question: faq?.question ?? '',
    answer: faq?.answer ?? '',
    order: String(faq?.order ?? defaultOrder),
    published: faq?.published ?? true,
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
      <FormField label="Pregunta" htmlFor="f-question" error={errors.question}>
        <Input
          id="f-question"
          value={values.question}
          aria-invalid={Boolean(errors.question)}
          className="h-10"
          onChange={(e) => setField('question', e.target.value)}
        />
      </FormField>
      <FormField
        label="Respuesta"
        htmlFor="f-answer"
        error={errors.answer}
        hint={`${values.answer.length}/600 caracteres`}
      >
        <Textarea
          id="f-answer"
          rows={5}
          value={values.answer}
          aria-invalid={Boolean(errors.answer)}
          onChange={(e) => setField('answer', e.target.value)}
        />
      </FormField>
      <FormField label="Orden" htmlFor="f-order" error={errors.order} hint="Las de menor número se muestran primero">
        <Input
          id="f-order"
          type="number"
          min={1}
          step={1}
          value={values.order}
          aria-invalid={Boolean(errors.order)}
          className="h-10 w-28"
          onChange={(e) => setField('order', e.target.value)}
        />
      </FormField>
      <SwitchRow id="f-published" label="Publicada" description="Visible en la sección de preguntas">
        <Switch id="f-published" checked={values.published} onCheckedChange={(v) => setField('published', v)} />
      </SwitchRow>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
        <SubmitButton pending={pending} label={faq ? 'Guardar cambios' : 'Crear pregunta'} />
      </DialogFooter>
    </form>
  )
}
