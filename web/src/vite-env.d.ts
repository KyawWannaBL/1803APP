/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_MAPBOX_ACCESS_TOKEN?: string
  readonly VITE_DEFAULT_LOCALE?: string
  readonly VITE_FALLBACK_LOCALE?: string
  readonly VITE_APP_ENV?: string
  readonly VITE_ENABLE_DEMO_FALLBACK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
