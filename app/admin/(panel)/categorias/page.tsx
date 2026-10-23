import type { Metadata } from 'next'
import { CategoriesManager } from '@/components/admin/categories/categories-manager'

export const metadata: Metadata = { title: 'Categorías' }

export default function CategoriesPage() {
  return <CategoriesManager />
}
