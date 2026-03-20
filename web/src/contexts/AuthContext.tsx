import type { ReactNode } from 'react';
import { AuthProvider as CoreAuthProvider, useAuth as useCoreAuth } from '@/auth/AuthProvider';

export type AuthSnapshot = {
  user: Record<string, unknown> | null;
  userId: string | null;
  username: string | null;
  fullName: string | null;
  role: string | null;
  permissions: string[];
  mustChangePassword: boolean;
  isAuthenticated: boolean;
  loading: boolean;
};

export type AuthContextValue = AuthSnapshot & {
  refresh: () => Promise<void>;
  setAuthState?: (next: Partial<AuthSnapshot>) => void;
  logout?: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

const noopAsync = async () => undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  return <CoreAuthProvider>{children}</CoreAuthProvider>;
}

export function useAuth(): AuthContextValue {
  const auth = useCoreAuth() as any;

  const user = (auth?.user ?? null) as Record<string, unknown> | null;
  const roleValue = user?.role ?? auth?.role ?? null;
  const role = roleValue ? String(roleValue).toUpperCase() : null;

  const permissions = Array.isArray(user?.permissions)
    ? user.permissions.map((item) => String(item))
    : Array.isArray(auth?.permissions)
    ? auth.permissions.map((item: unknown) => String(item))
    : [];

  const logout =
    typeof auth?.signOut === 'function'
      ? async () => {
          await auth.signOut();
        }
      : typeof auth?.logout === 'function'
      ? async () => {
          await auth.logout();
        }
      : noopAsync;

  const refresh =
    typeof auth?.refresh === 'function'
      ? async () => {
          await auth.refresh();
        }
      : noopAsync;

  return {
    user,
    userId: user?.id ? String(user.id) : null,
    username: user?.email ? String(user.email) : null,
    fullName: user?.fullName
      ? String(user.fullName)
      : user?.name
      ? String(user.name)
      : null,
    role,
    permissions,
    mustChangePassword: Boolean(user?.mustChangePassword ?? auth?.mustChangePassword),
    isAuthenticated: Boolean(user),
    loading: Boolean(auth?.loading),
    refresh,
    setAuthState: undefined,
    logout,
    hasPermission: (permission: string) => permissions.includes(permission),
    hasAnyPermission: (items: string[]) => items.some((item) => permissions.includes(item)),
    hasAllPermissions: (items: string[]) => items.every((item) => permissions.includes(item)),
  };
}

export default useAuth;
