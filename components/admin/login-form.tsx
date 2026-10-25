'use client'

import { useActionState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { loginAction, type LoginState } from '@/app/admin/actions'
import { FormField } from '@/components/admin/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  from: string
}

export function LoginForm({ from }: Props) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {})

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="from" value={from} />

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      <FormField label="Correo electrónico" htmlFor="email" error={state.fieldErrors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={state.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          className="h-10"
          required
        />
      </FormField>

      <FormField label="Contraseña" htmlFor="password" error={state.fieldErrors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
          className="h-10"
          required
        />
      </FormField>

      <Button type="submit" size="lg" className="h-11 rounded-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {pending ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  )
}
