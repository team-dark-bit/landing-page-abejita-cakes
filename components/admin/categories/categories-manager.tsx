'use client'

import { useMemo, useState } from 'react'
import { Pencil, Plus, SearchX, Tags, Trash2 } from 'lucide-react'
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
import { useResource, refreshResource } from '@/hooks/use-resource'
import { useZodForm } from '@/hooks/use-zod-form'
import { categorySchema } from '@/lib/admin/schemas'
import type { AdminCategory, AdminCategoryInput } from '@/lib/admin/types'

type StatusFilter = 'all' | 'active' | 'inactive'

export function CategoriesManager() {
  const categories = useResource('categories')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [deleting, setDeleting] = useState<AdminCategory | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return categories.items
      .filter((c) => (status === 'all' ? true : status === 'active' ? c.active : !c.active))
      .filter((c) => !term || `${c.name} ${c.slug} ${c.description}`.toLowerCase().includes(term))
  }, [categories.items, search, status])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  async function handleSubmit(input: AdminCategoryInput) {
    try {
      if (editing) {
        await categories.update(editing.id, input)
        toast.success('Categoría actualizada', { description: input.name })
      } else {
        await categories.create(input)
        toast.success('Categoría creada', { description: input.name })
      }
      // Los productos muestran el nombre de su categoría.
      await refreshResource('products')
      setFormOpen(false)
    } catch (error) {
      toast.error('No se pudo guardar la categoría', { description: errorMessage(error) })
    }
  }

  function requestDelete(category: AdminCategory) {
    // `productCount` del admin incluye activos e inactivos.
    if (category.productCount > 0) {
      toast.error('Esta categoría tiene productos', {
        description: `Mueve o elimina sus ${category.productCount} producto(s) antes de borrarla.`,
      })
      return
    }
    setDeleting(category)
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await categories.remove(deleting.id)
      toast.success('Categoría eliminada', { description: deleting.name })
    } catch (error) {
      toast.error('No se pudo eliminar', { description: errorMessage(error) })
    }
  }

  const isLoading = categories.isLoading

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Organiza el catálogo. Las categorías inactivas se ocultan del sitio."
        action={
          <Button onClick={openCreate} className="rounded-full" size="lg">
            <Plus className="size-4" aria-hidden="true" />
            Nueva categoría
          </Button>
        }
      />

      <ResourceCard>
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Buscar categoría"
          resultLabel={isLoading ? 'Cargando…' : `${filtered.length} de ${categories.items.length} categorías`}
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
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </NativeSelect>
        </Toolbar>

        {categories.error ? (
          <ErrorState message={categories.error.message} onRetry={categories.reload} />
        ) : isLoading ? (
          <TableSkeleton rows={4} />
        ) : categories.items.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="Aún no hay categorías"
            description="Crea categorías para agrupar tus productos en el catálogo."
            action={
              <Button onClick={openCreate} className="rounded-full">
                <Plus className="size-4" aria-hidden="true" />
                Crear categoría
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={SearchX} title="Sin resultados" description="Ninguna categoría coincide con los filtros." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="pr-4 text-right">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="pl-4">
                    <div className="flex min-w-48 flex-col">
                      <span className="font-semibold">{category.name}</span>
                      {category.description && (
                        <span className="truncate text-xs text-muted-foreground">{category.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">{category.slug}</code>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{category.productCount}</TableCell>
                  <TableCell>
                    <StatusPill on={category.active} onLabel="Activa" offLabel="Inactiva" />
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${category.name}`}
                        onClick={() => {
                          setEditing(category)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${category.name}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => requestDelete(category)}
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
            <DialogTitle className="font-serif text-xl">{editing ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
            <DialogDescription>
              El identificador de URL (slug) lo genera el backend y no cambia al renombrar.
            </DialogDescription>
          </DialogHeader>
          {formOpen && (
            <CategoryForm key={editing?.id ?? 'new'} category={editing} onSubmit={handleSubmit} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar esta categoría?"
        description={`"${deleting?.name ?? ''}" se eliminará permanentemente.`}
        onConfirm={handleDelete}
      />
    </>
  )
}

function CategoryForm({
  category,
  onSubmit,
}: {
  category: AdminCategory | null
  onSubmit: (input: AdminCategoryInput) => Promise<void>
}) {
  const [pending, setPending] = useState(false)
  const { values, errors, setField, validate } = useZodForm(categorySchema, {
    name: category?.name ?? '',
    description: category?.description ?? '',
    active: category?.active ?? true,
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
      <FormField label="Nombre" htmlFor="cat-name" error={errors.name}>
        <Input
          id="cat-name"
          value={values.name}
          aria-invalid={Boolean(errors.name)}
          className="h-10"
          onChange={(e) => setField('name', e.target.value)}
        />
      </FormField>
      {category && (
        <FormField
          label="Slug"
          htmlFor="cat-slug"
          hint="Identificador de URL. No cambia al renombrar la categoría."
        >
          <Input
            id="cat-slug"
            value={category.slug}
            readOnly
            disabled
            className="h-10 font-mono text-sm"
          />
        </FormField>
      )}
      <FormField
        label="Descripción (opcional)"
        htmlFor="cat-description"
        error={errors.description}
        hint={`${values.description.length}/160 caracteres`}
      >
        <Textarea
          id="cat-description"
          rows={2}
          value={values.description}
          aria-invalid={Boolean(errors.description)}
          onChange={(e) => setField('description', e.target.value)}
        />
      </FormField>
      <SwitchRow id="cat-active" label="Activa" description="Se muestra como filtro en el catálogo">
        <Switch id="cat-active" checked={values.active} onCheckedChange={(v) => setField('active', v)} />
      </SwitchRow>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancelar</DialogClose>
        <SubmitButton pending={pending} label={category ? 'Guardar cambios' : 'Crear categoría'} />
      </DialogFooter>
    </form>
  )
}
