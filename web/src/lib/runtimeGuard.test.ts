import { describe, expect, it } from 'vitest';
import { getRuntimeGuardError } from '@/lib/runtimeGuard';

describe('getRuntimeGuardError', () => {
  it('allows demo mode in development', () => {
    expect(
      getRuntimeGuardError({
        appEnv: 'development',
        enableDemoFallback: true,
        isSupabaseConfigured: false,
      }),
    ).toBeNull();
  });

  it('blocks demo fallback in staging', () => {
    expect(
      getRuntimeGuardError({
        appEnv: 'staging',
        enableDemoFallback: true,
        isSupabaseConfigured: true,
      }),
    ).toContain('Demo fallback');
  });

  it('requires supabase config in production', () => {
    expect(
      getRuntimeGuardError({
        appEnv: 'production',
        enableDemoFallback: false,
        isSupabaseConfigured: false,
      }),
    ).toContain('Supabase credentials');
  });
});
