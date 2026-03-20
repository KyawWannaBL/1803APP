import { env, isSupabaseConfigured as supabaseConfigured } from '@/lib/env'

export type AppEnv = 'development' | 'staging' | 'production'

export type RuntimeGuardInput = {
  appEnv: AppEnv
  enableDemoFallback: boolean
  isSupabaseConfigured: boolean
}

export function getRuntimeGuardError({
  appEnv,
  enableDemoFallback,
  isSupabaseConfigured,
}: RuntimeGuardInput): string | null {
  const isProtectedEnv = appEnv === 'staging' || appEnv === 'production'

  if (isProtectedEnv && enableDemoFallback) {
    return 'Demo fallback must be disabled in staging and production.'
  }

  if (isProtectedEnv && !isSupabaseConfigured) {
    return 'Supabase credentials are required in staging and production.'
  }

  return null
}

export function assertRuntimeSafety(): void {
  const error = getRuntimeGuardError({
    appEnv: env.appEnv as AppEnv,
    enableDemoFallback: env.enableDemoFallback,
    isSupabaseConfigured: supabaseConfigured,
  })

  if (error) {
    throw new Error(error)
  }
}