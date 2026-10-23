import type { Metadata } from 'next'
import { ProductsManager } from '@/components/admin/products/products-manager'

export const metadata: Metadata = { title: 'Productos' }

export default function ProductsPage() {
  return <ProductsManager />
}
