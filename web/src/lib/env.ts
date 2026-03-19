export type AppEnv = 'development' | 'staging' | 'production'

function readEnv(name: keyof ImportMetaEnv, fallback = ''): string {
  return import.meta.env[name] ?? fallback
}

function readBool(name: keyof ImportMetaEnv, fallback = false): boolean {
  const value = import.meta.env[name]
  if (value === undefined) return fallback
  return value === 'true'
}

export const env = {
  appName: readEnv('VITE_APP_NAME', 'Britium Enterprise Delivery Platform'),
  supabaseUrl: readEnv('VITE_SUPABASE_URL', ''),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY', ''),
  mapboxToken: readEnv('VITE_MAPBOX_ACCESS_TOKEN', ''),
  defaultLocale: readEnv('VITE_DEFAULT_LOCALE', 'en'),
  fallbackLocale: readEnv('VITE_FALLBACK_LOCALE', 'mm'),
  appEnv: readEnv('VITE_APP_ENV', 'development') as AppEnv,
  enableDemoFallback: readBool('VITE_ENABLE_DEMO_FALLBACK', true),
}

export function assertRequiredEnv() {
  const missing: string[] = []

  if (!env.supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!env.supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}


export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey)
