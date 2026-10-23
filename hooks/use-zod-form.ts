'use client'

import { useState } from 'react'
import type { z } from 'zod'

export function useZodForm<TValues extends Record<string, unknown>, TOutput>(
  schema: z.ZodType<TOutput>,
  initialValues: TValues,
) {
  const [values, setValues] = useState<TValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>({})

  function setField<K extends keyof TValues>(field: K, value: TValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  function validate(): TOutput | null {
    const result = schema.safeParse(values)
    if (result.success) {
      setErrors({})
      return result.data
    }
    const next: Partial<Record<keyof TValues, string>> = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof TValues
      if (field !== undefined && !next[field]) next[field] = issue.message
    }
    setErrors(next)
    return null
  }

  function setFieldError(field: keyof TValues, message: string) {
    setErrors((current) => ({ ...current, [field]: message }))
  }

  return { values, errors, setField, setFieldError, validate }
}
