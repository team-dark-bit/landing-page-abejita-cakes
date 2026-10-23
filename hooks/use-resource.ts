'use client'

import useSWR, { mutate as globalMutate } from 'swr'
import { repositories, type ResourceName } from '@/lib/admin/repositories'
import type { Repository } from '@/lib/admin/repository'
import type { AdminCategory, AdminFaq, AdminProduct, AdminTestimonial, EntityInput } from '@/lib/admin/types'

type EntityMap = {
  products: AdminProduct
  categories: AdminCategory
  testimonials: AdminTestimonial
  faqs: AdminFaq
}

const swrKey = (name: ResourceName) => ['admin', name] as const

export function useResource<N extends ResourceName>(name: N) {
  type T = EntityMap[N]
  const repo = repositories[name] as unknown as Repository<T>
  const { data, error, isLoading, mutate } = useSWR(swrKey(name), () => repo.list(), {
    revalidateOnFocus: false,
  })

  return {
    items: data ?? [],
    isLoading,
    error: error as Error | undefined,
    reload: () => mutate(),
    async create(input: EntityInput<T>) {
      const item = await repo.create(input)
      await mutate()
      return item
    },
    async update(id: string, input: Partial<EntityInput<T>>) {
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

export async function resetAllResources() {
  await Promise.all(Object.values(repositories).map((repo) => repo.reset()))
  await Promise.all(
    (Object.keys(repositories) as ResourceName[]).map((name) => globalMutate(swrKey(name))),
  )
}
