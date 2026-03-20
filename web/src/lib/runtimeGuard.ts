import { env, isSupabaseConfigured } from '@/lib/env'

export type RuntimeGuardInput = {
  appEnv: 'development' | 'staging' | 'production'
  enableDemoFallback: boolean
  isSupabaseConfigured: boolean
}

export function getRuntimeGuardError(input: RuntimeGuardInput): string | null {
  const isProtectedEnv = input.appEnv === 'staging' || input.appEnv === 'production'

  if (isProtectedEnv && input.enableDemoFallback) {
    return 'Demo fallback must be disabled in staging and production.'
  }

  if (isProtectedEnv && !input.isSupabaseConfigured) {
    return 'Supabase credentials are required in staging and production.'
  }

  return null
}

export function assertRuntimeSafety() {
  const error = getRuntimeGuardError({
    appEnv: env.appEnv,
    enableDemoFallback: env.enableDemoFallback,
    isSupabaseConfigured,
  })

  if (error) {
    throw new Error(error)
  }
}
