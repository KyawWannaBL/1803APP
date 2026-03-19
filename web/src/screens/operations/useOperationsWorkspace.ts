import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchOperationsWorkspace, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

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

async function safeFetch(table: string, limit = 50) {
  try {
    return await fetchDataset(table, limit);
  } catch {
    return [];
  }
}

export function useOperationsWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<PortalSummary>(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [tasks, setTasks] = useState<GenericRecord[]>([]);
  const [routes, setRoutes] = useState<GenericRecord[]>([]);
  const [tracking, setTracking] = useState<GenericRecord[]>([]);
  const [riders, setRiders] = useState<GenericRecord[]>([]);
  const [tickets, setTickets] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, workspace, riderRows, ticketRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'OPS'),
        fetchOperationsWorkspace(),
        safeFetch('riders', 100),
        safeFetch('tickets', 100),
      ]);

      setSummary(portalSummary);
      setOrders(workspace.orders ?? []);
      setTasks(workspace.tasks ?? []);
      setRoutes(workspace.routes ?? []);
      setTracking(workspace.tracking ?? []);
      setRiders(riderRows);
      setTickets(ticketRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load operations workspace.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [user?.id, user?.role]);

  const unassignedTasks = useMemo(
    () => tasks.filter((row) => !row.assigned_rider_id && ['validated', 'ready_for_assignment', 'created'].includes(String(row.status ?? row.status_code ?? ''))),
    [tasks],
  );

  const inTransitTasks = useMemo(
    () => tasks.filter((row) => ['picked_up', 'in_transit'].includes(String(row.status))),
    [tasks],
  );

  const failedTasks = useMemo(
    () => tasks.filter((row) => String(row.status) === 'failed'),
    [tasks],
  );

  const newOrders = useMemo(
    () => orders.filter((row) => ['created', 'validated'].includes(String(row.status_code ?? row.status))),
    [orders],
  );

  return {
    summary,
    orders,
    tasks,
    routes,
    tracking,
    riders,
    tickets,
    busy,
    error,
    reload,
    unassignedTasks,
    inTransitTasks,
    failedTasks,
    newOrders,
  };
}
