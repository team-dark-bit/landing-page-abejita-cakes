'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { adminNav } from './nav-items'
import { PageHeader, ResourceCard } from './resource-ui'
import { Skeleton } from '@/components/ui/skeleton'
import { useResource } from '@/hooks/use-resource'

export function Overview() {
  const products = useResource('products')
  const categories = useResource('categories')
  const testimonials = useResource('testimonials')
  const faqs = useResource('faqs')

  const loading = products.isLoading || categories.isLoading || testimonials.isLoading || faqs.isLoading

  const modules = [
    {
      ...adminNav[1],
      total: products.items.length,
      detail: `${products.items.filter((p) => p.active).length} activos`,
    },
    {
      ...adminNav[2],
      total: categories.items.length,
      detail: `${categories.items.filter((c) => c.active).length} activas`,
    },
    {
      ...adminNav[3],
      total: testimonials.items.length,
      detail: `${testimonials.items.filter((t) => t.published).length} publicados`,
    },
    {
      ...adminNav[4],
      total: faqs.items.length,
      detail: `${faqs.items.filter((f) => f.published).length} publicadas`,
    },
  ]

  const featured = products.items.filter((p) => p.featured)

  return (
    <>
      <PageHeader
        title="Hola, bienvenida de vuelta"
        description="Un vistazo rápido al contenido que se muestra en el sitio de Abejita Cakes."
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <li key={module.href}>
              <Link
                href={module.href}
                className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-muted-foreground">{module.label}</span>
                  {loading ? (
                    <Skeleton className="mt-1 h-8 w-16" />
                  ) : (
                    <span className="font-serif text-3xl font-semibold tabular-nums">{module.total}</span>
                  )}
                  <span className="text-xs text-muted-foreground">{loading ? '\u00a0' : module.detail}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <ResourceCard>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="flex items-center gap-2 font-serif text-lg font-semibold">
            <Star className="size-4 fill-honey text-honey" aria-hidden="true" />
            Productos destacados
          </h2>
          <Link href="/admin/productos" className="text-sm font-semibold hover:underline">
            Gestionar
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-hidden p-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-40 w-44 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No hay productos destacados. Marca alguno como destacado desde Productos.
          </p>
        ) : (
          <ul className="no-scrollbar flex gap-4 overflow-x-auto p-4">
            {featured.map((product) => (
              <li key={product.id} className="flex w-44 shrink-0 flex-col gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image || '/placeholder.svg'}
                  alt=""
                  className="aspect-[4/3] w-full rounded-xl bg-muted object-cover"
                />
                <div className="flex flex-col">
                  <span className="truncate text-sm font-semibold">{product.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Desde S/ {product.priceFrom} {product.active ? '' : '· inactivo'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ResourceCard>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Todo el contenido del sitio se administra en el servidor: productos, categorías,
        testimonios y preguntas frecuentes se leen y escriben en la API.
      </p>
    </>
  )
}
