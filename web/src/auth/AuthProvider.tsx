import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { demoUsers } from '@/auth/demoUsers';
import { supabase } from '@/lib/supabase';
import { env, isSupabaseConfigured } from '@/lib/env';
import type { SessionUser, AppRole } from '@/types';

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  mode: 'supabase' | 'supabase';
  signInDemo: (role: AppRole) => void;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'britium-demo-user-role';

async function fetchProfile(userId: string, email: string): Promise<SessionUser | null> {
  if (!supabase) return null;

  const profileResult = await supabase
    .from('profiles')
    .select('id, full_name, email, default_role, role')
    .eq('id', userId)
    .maybeSingle();

  if (profileResult.data) {
    return {
      id: profileResult.data.id,
      email: profileResult.data.email ?? email,
      fullName: profileResult.data.full_name ?? email,
      role: (profileResult.data.default_role ?? profileResult.data.role ?? 'EA') as AppRole,
    };
  }

  const assignmentResult = await supabase
    .from('user_role_assignments')
    .select('role_code')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  return {
    id: userId,
    email,
    fullName: email,
    role: (assignmentResult.data?.role_code ?? 'EA') as AppRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const mode: 'supabase' | 'supabase' =
    isSupabaseConfigured && (!env.enableDemoFallback || env.appEnv === 'production') ? 'supabase' : 'demo';

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (mode === 'demo') {
        const storedRole = (localStorage.getItem(STORAGE_KEY) as AppRole | null) ?? 'EA';
        const demoUser = demoUsers.find((item) => item.role === storedRole) ?? demoUsers[0];
        if (active) {
          setUser(demoUser);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase!.auth.getSession();
      const session = data.session;

      if (!session) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const profile = await fetchProfile(
        session.user.id,
        session.user.email ?? 'unknown@britium.local',
      );

      if (active) {
        setUser(profile);
        setLoading(false);
      }
    }

    void bootstrap();

    const subscription = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profile = await fetchProfile(
        session.user.id,
        session.user.email ?? 'unknown@britium.local',
      );

      setUser(profile);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, [mode]);

  const signInWithPassword = async (email: string, password: string) => {
    if (mode === 'demo') {
      if (!password) return { error: 'Password is required.' };
      const found = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
      if (!found) return { error: 'Demo user not found.' };
      localStorage.setItem(STORAGE_KEY, found.role);
      setUser(found);
      setLoading(false);
      return {};
    }

    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      mode,
      signInDemo: (role) => {
        const demoUser = demoUsers.find((item) => item.role === role) ?? demoUsers[0];
        localStorage.setItem(STORAGE_KEY, demoUser.role);
        setUser(demoUser);
        setLoading(false);
      },
      signInWithPassword,
      signIn: async (email, password) => {
        const result = await signInWithPassword(email, password);
        if (result.error) throw new Error(result.error);
      },
      signOut: async () => {
        if (mode === 'demo') {
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
          return;
        }
        await supabase!.auth.signOut();
        setUser(null);
      },
    }),
    [user, loading, mode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}