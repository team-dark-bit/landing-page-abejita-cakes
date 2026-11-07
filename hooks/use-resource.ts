'use client'

import useSWR, { mutate as globalMutate } from 'swr'
import { repositories, type ResourceName } from '@/lib/admin/repositories'
import type { Repository } from '@/lib/admin/repository'
import type {
  AdminCategory,
  AdminFaq,
  AdminProduct,
  AdminTestimonial,
  ResourceInput,
} from '@/lib/admin/types'

type EntityMap = {
  products: AdminProduct
  categories: AdminCategory
  testimonials: AdminTestimonial
  faqs: AdminFaq
}

const swrKey = (name: ResourceName) => ['admin', name] as const

/** Revalida otro recurso cuyo contenido depende del que se acaba de cambiar. */
export function refreshResource(name: ResourceName) {
  return globalMutate(swrKey(name))
}

export function useResource<N extends ResourceName>(name: N) {
  type T = EntityMap[N]
  type I = ResourceInput[N]
  const repo = repositories[name] as unknown as Repository<T, I>
  const { data, error, isLoading, mutate } = useSWR(swrKey(name), () => repo.list(), {
    revalidateOnFocus: false,
  })

  return {
    items: data ?? [],
    isLoading,
    error: error as Error | undefined,
    reload: () => mutate(),
    async create(input: I) {
      const item = await repo.create(input)
      await mutate()
      return item
    },
    async update(id: string, input: Partial<I>) {
      const item = await repo.update(id, input)
      await mutate()
      return item
    },
    async remove(id: string) {
      await repo.remove(id)
      await mutate()
    },
  }
}
