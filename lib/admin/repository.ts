import type { BaseEntity } from './types'

/**
 * Contrato usado por la UI del panel. Cada recurso se respalda con una
 * implementación sobre la API (`lib/admin/*-api.ts`); los componentes no
 * conocen el transporte.
 */
export interface Repository<T extends BaseEntity, TInput> {
  list(): Promise<T[]>
  create(input: TInput): Promise<T>
  update(id: string, input: Partial<TInput>): Promise<T>
  remove(id: string): Promise<void>
}
