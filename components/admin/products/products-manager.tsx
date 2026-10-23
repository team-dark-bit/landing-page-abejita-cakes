'use client'

import { useMemo, useState } from 'react'
import { CakeSlice, Pencil, Plus, SearchX, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ProductFormDialog } from './product-form-dialog'
import {
  ConfirmDeleteDialog,
  EmptyState,
  ErrorState,
  PageHeader,
  ResourceCard,
  StatusPill,
  TableSkeleton,
  Toolbar,
  errorMessage,
} from '@/components/admin/resource-ui'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useResource } from '@/hooks/use-resource'
import type { AdminProduct, EntityInput } from '@/lib/admin/types'

type StatusFilter = 'all' | 'active' | 'inactive' | 'featured'

const priceFormat = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

export function ProductsManager() {
  const products = useResource('products')
  const categories = useResource('categories')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [deleting, setDeleting] = useState<AdminProduct | null>(null)

  const categoryName = useMemo(
    () => new Map(categories.items.map((c) => [c.id, c.name])),
    [categories.items],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.items
      .filter((p) => (category === 'all' ? true : p.categoryId === category))
      .filter((p) => {
        if (status === 'active') return p.active
        if (status === 'inactive') return !p.active
        if (status === 'featured') return p.featured
        return true
      })
      .filter((p) => !term || `${p.name} ${p.description} ${p.size}`.toLowerCase().includes(term))
  }, [products.items, search, category, status])

  const imageSuggestions = useMemo(
    () => Array.from(new Set(products.items.map((p) => p.image))),
    [products.items],
  )

  const hasFilters = search !== '' || category !== 'all' || status !== 'all'

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  async function handleSubmit(input: EntityInput<AdminProduct>) {
    try {
      if (editing) {
        await products.update(editing.id, input)
        toast.success('Producto actualizado', { description: input.name })
      } else {
        await products.create(input)
        toast.success('Producto creado', { description: input.name })
      }
      setFormOpen(false)
    } catch (error) {
      toast.error('No se pudo guardar el producto', { description: errorMessage(error) })
    }
  }

  async function toggleActive(product: AdminProduct, active: boolean) {
    try {
      await products.update(product.id, { active })
      toast.success(active ? 'Producto activado' : 'Producto desactivado', { description: product.name })
    } catch (error) {
      toast.error('No se pudo cambiar el estado', { description: errorMessage(error) })
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await products.remove(deleting.id)
      toast.success('Producto eliminado', { description: deleting.name })
    } catch (error) {
      toast.error('No se pudo eliminar', { description: errorMessage(error) })
    }
  }

  const isLoading = products.isLoading || categories.isLoading

  return (
    <>
      <PageHeader
        title="Productos"
        description="Gestiona tortas, bocaditos y combos del catálogo público."
        action={
          <Button onClick={openCreate} className="rounded-full" size="lg">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo producto
          </Button>
        }
      />

      <ResourceCard>
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          placeholder="Buscar por nombre, descripción o tamaño"
          resultLabel={isLoading ? 'Cargando…' : `${filtered.length} de ${products.items.length} productos`}
          hasActiveFilters={hasFilters}
          onClear={() => {
            setSearch('')
            setCategory('all')
            setStatus('all')
          }}
        >
          <NativeSelect
            aria-label="Filtrar por categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="[&_select]:h-10"
          >
            <option value="all">Todas las categorías</option>
            {categories.items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="featured">Destacados</option>
          </NativeSelect>
        </Toolbar>

        {products.error ? (
          <ErrorState message={products.error.message} onRetry={products.reload} />
        ) : isLoading ? (
          <TableSkeleton />
        ) : products.items.length === 0 ? (
          <EmptyState
            icon={CakeSlice}
            title="Aún no hay productos"
            description="Crea tu primer producto para que aparezca en el catálogo."
            action={
              <Button onClick={openCreate} className="rounded-full">
                <Plus className="size-4" aria-hidden="true" />
                Crear producto
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description="Ningún producto coincide con la búsqueda o los filtros aplicados."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio desde</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="pr-4 text-right">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-4">
                    <div className="flex min-w-64 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          if (!e.currentTarget.src.endsWith('/placeholder.svg')) e.currentTarget.src = '/placeholder.svg'
                        }}
                        className="size-11 shrink-0 rounded-lg bg-muted object-cover"
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <span className="truncate">{product.name}</span>
                          {product.featured && (
                            <Star className="size-3.5 shrink-0 fill-honey text-honey" aria-label="Destacado" />
                          )}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">{product.size}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {categoryName.get(product.categoryId) ?? 'Sin categoría'}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {priceFormat.format(product.priceFrom)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.active}
                        onCheckedChange={(v) => toggleActive(product, v)}
                        aria-label={`${product.active ? 'Desactivar' : 'Activar'} ${product.name}`}
                      />
                      <StatusPill on={product.active} onLabel="Activo" offLabel="Inactivo" />
                    </div>
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Editar ${product.name}`}
                        onClick={() => {
                          setEditing(product)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Eliminar ${product.name}`}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleting(product)}
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

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories.items}
        imageSuggestions={imageSuggestions}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar este producto?"
        description={`"${deleting?.name ?? ''}" se eliminará del catálogo. Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
      />
    </>
  )
}
