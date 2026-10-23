import type { BaseEntity, EntityInput } from './types'

/**
 * Storage-agnostic contract used by the admin UI. To move to Supabase or
 * Firebase, implement this interface (e.g. createSupabaseRepository) and swap
 * the instances exported from `lib/admin/repositories.ts`. No UI code changes.
 */
export interface Repository<T extends BaseEntity> {
  list(): Promise<T[]>
  create(input: EntityInput<T>): Promise<T>
  update(id: string, input: Partial<EntityInput<T>>): Promise<T>
  remove(id: string): Promise<void>
  reset(): Promise<void>
}

const STORAGE_PREFIX = 'abejita-admin:v1:'
const SIMULATED_LATENCY_MS = 250

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function createLocalStorageRepository<T extends BaseEntity>(
  collection: string,
  seed: T[],
): Repository<T> {
  const key = `${STORAGE_PREFIX}${collection}`

  function read(): T[] {
    if (typeof window === 'undefined') return structuredClone(seed)
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      write(seed)
      return structuredClone(seed)
    }
    try {
      return JSON.parse(raw) as T[]
    } catch {
      write(seed)
      return structuredClone(seed)
    }
  }

  function write(items: T[]) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(items))
  }

  return {
    async list() {
      await wait(SIMULATED_LATENCY_MS)
      return read()
    },
    async create(input) {
      await wait(SIMULATED_LATENCY_MS)
      const now = new Date().toISOString()
      const item = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now } as T
      write([item, ...read()])
      return item
    },
    async update(id, input) {
      await wait(SIMULATED_LATENCY_MS)
      const items = read()
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) throw new Error('El registro ya no existe.')
      const updated = { ...items[index], ...input, updatedAt: new Date().toISOString() }
      items[index] = updated
      write(items)
      return updated
    },
    async remove(id) {
      await wait(SIMULATED_LATENCY_MS)
      write(read().filter((item) => item.id !== id))
    },
    async reset() {
      write(seed)
    },
  }
}
