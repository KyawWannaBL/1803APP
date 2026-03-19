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

export function useDataEntryWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [approvals, setApprovals] = useState<GenericRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, approvalRows, logRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'DATA_ENTRY'),
        safeFetch('orders', 100),
        safeFetch('approvals', 100),
        safeFetch('audit_logs', 100),
      ]);

      setSummary(portalSummary);
      setOrders(orderRows);
      setApprovals(approvalRows);
      setActivityLogs(logRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load data entry workspace.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [user?.id, user?.role]);

  const draftOrders = useMemo(
    () => orders.filter((r) => ['draft','pending_validation','intake'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())),
    [orders],
  );

  const validationIssues = useMemo(
    () => orders.filter((r) => ['invalid','correction_required','rejected'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())),
    [orders],
  );

  return {
    summary,
    orders,
    approvals,
    activityLogs,
    busy,
    error,
    reload,
    draftOrders,
    validationIssues,
  };
}
