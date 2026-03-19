import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

type PortalSummary = {
  totalOrders: number;
  activeTasks: number;
  openTickets: number;
  inboundManifests: number;
  outboundManifests: number;
  notifications: number;
};

const defaultSummary: PortalSummary = {
  totalOrders: 0,
  activeTasks: 0,
  openTickets: 0,
  inboundManifests: 0,
  outboundManifests: 0,
  notifications: 0,
};

async function safeFetch(table: string, limit = 100) {
  try {
    return await fetchDataset(table, limit);
  } catch {
    return [];
  }
}

export function useBranchOfficeWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [riders, setRiders] = useState<GenericRecord[]>([]);
  const [tickets, setTickets] = useState<GenericRecord[]>([]);
  const [branches, setBranches] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, riderRows, ticketRows, branchRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'BRANCH_MANAGER'),
        safeFetch('orders', 100),
        safeFetch('riders', 100),
        safeFetch('tickets', 100),
        safeFetch('branches', 100),
      ]);

      setSummary(portalSummary);
      setOrders(orderRows);
      setRiders(riderRows);
      setTickets(ticketRows);
      setBranches(branchRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load branch office workspace.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [user?.id, user?.role]);

  const localExceptions = useMemo(
    () => orders.filter((r) => ['failed','on_hold','exception','cancelled'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())),
    [orders],
  );

  const localDispatchOrders = useMemo(
    () => orders.filter((r) => ['ready_for_assignment','assigned','picked_up','in_transit'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())),
    [orders],
  );

  return {
    summary,
    orders,
    riders,
    tickets,
    branches,
    busy,
    error,
    reload,
    localExceptions,
    localDispatchOrders,
  };
}
