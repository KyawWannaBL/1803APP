import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

type PortalSummary = { totalOrders: number; activeTasks: number; openTickets: number; inboundManifests: number; outboundManifests: number; notifications: number };
const defaultSummary: PortalSummary = { totalOrders: 0, activeTasks: 0, openTickets: 0, inboundManifests: 0, outboundManifests: 0, notifications: 0 };

async function safeFetch(table: string, limit = 100) { try { return await fetchDataset(table, limit); } catch { return []; } }

export function useAdminWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [organizations, setOrganizations] = useState<GenericRecord[]>([]);
  const [branches, setBranches] = useState<GenericRecord[]>([]);
  const [users, setUsers] = useState<GenericRecord[]>([]);
  const [roles, setRoles] = useState<GenericRecord[]>([]);
  const [permissions, setPermissions] = useState<GenericRecord[]>([]);
  const [settings, setSettings] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orgRows, branchRows, userRows, roleRows, permissionRows, settingRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'SA'),
        safeFetch('organizations', 100),
        safeFetch('branches', 100),
        safeFetch('users', 100),
        safeFetch('roles', 100),
        safeFetch('permissions', 100),
        safeFetch('system_settings', 100),
      ]);
      setSummary(portalSummary);
      setOrganizations(orgRows);
      setBranches(branchRows);
      setUsers(userRows);
      setRoles(roleRows);
      setPermissions(permissionRows);
      setSettings(settingRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load admin workspace.');
    } finally { setBusy(false); }
  }

  useEffect(() => { void reload(); }, [user?.id, user?.role]);

  const activeOrganizations = useMemo(() => organizations.filter((r) => String(r.status ?? 'active') !== 'inactive'), [organizations]);
  const activeUsers = useMemo(() => users.filter((r) => String(r.status ?? 'active') !== 'inactive'), [users]);

  return { summary, organizations, branches, users, roles, permissions, settings, busy, error, reload, activeOrganizations, activeUsers };
}
