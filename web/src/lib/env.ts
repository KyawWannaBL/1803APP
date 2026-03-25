export type AppEnv = 'development' | 'staging' | 'production';

function normalizeAppEnv(value: string | undefined): AppEnv {
  if (value === 'production') return 'production';
  if (value === 'staging') return 'staging';
  return 'development';
}

function normalizeLocale(value: string | undefined): 'en' | 'mm' {
  return value === 'mm' ? 'mm' : 'en';
}

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();
const mapboxToken = String(
  import.meta.env.VITE_MAPBOX_TOKEN ??
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ??
  ''
).trim();

export const env = {
  appEnv: normalizeAppEnv(import.meta.env.VITE_APP_ENV),
  enableDemoFallback: false,
  supabaseUrl,
  supabaseAnonKey,
  mapboxToken,
  defaultLocale: normalizeLocale(import.meta.env.VITE_DEFAULT_LOCALE),
} as const;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isMapboxConfigured = Boolean(mapboxToken);
