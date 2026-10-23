import type { Metadata } from 'next'
import { Overview } from '@/components/admin/overview'

export const metadata: Metadata = { title: 'Resumen' }

export default function AdminHomePage() {
  return <Overview />
}
