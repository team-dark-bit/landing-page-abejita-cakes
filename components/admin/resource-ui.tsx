'use client'

import { AlertTriangle, Loader2, RotateCw, Search, X, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-semibold text-balance">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function ResourceCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('overflow-hidden rounded-2xl border bg-card', className)}>{children}</section>
}

export function Toolbar({
  search,
  onSearchChange,
  placeholder,
  children,
  resultLabel,
  hasActiveFilters,
  onClear,
}: {
  search: string
  onSearchChange: (value: string) => void
  placeholder: string
  children?: React.ReactNode
  resultLabel: string
  hasActiveFilters: boolean
  onClear: () => void
}) {
  return (
    <div className="flex flex-col gap-3 border-b p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-10 pl-9"
          />
        </div>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span aria-live="polite">{resultLabel}</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
          >
            <X className="size-3.5" aria-hidden="true" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-lg font-semibold">No pudimos cargar los datos</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry} className="rounded-full">
        <RotateCw className="size-4" aria-hidden="true" />
        Reintentar
      </Button>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4" aria-busy="true" aria-label="Cargando registros">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
        </div>
      ))}
    </div>
  )
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => Promise<void>
}) {
  const [pending, setPending] = useState(false)

  async function handleConfirm() {
    setPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function StatusPill({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        on ? 'bg-honey/25 text-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      <span className={cn('size-1.5 rounded-full', on ? 'bg-honey' : 'bg-muted-foreground/50')} aria-hidden="true" />
      {on ? onLabel : offLabel}
    </span>
  )
}

export function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {pending ? 'Guardando…' : label}
    </Button>
  )
}

export function SwitchRow({
  id,
  label,
  description,
  children,
}: {
  id: string
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-3">
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      {children}
    </div>
  )
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}
