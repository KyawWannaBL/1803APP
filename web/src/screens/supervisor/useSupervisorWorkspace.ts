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

export function useSupervisorWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [approvals, setApprovals] = useState<GenericRecord[]>([]);
  const [tickets, setTickets] = useState<GenericRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<GenericRecord[]>([]);
  const [riders, setRiders] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, approvalRows, ticketRows, auditRows, riderRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'SUPERVISOR'),
        safeFetch('orders', 100),
        safeFetch('approvals', 100),
        safeFetch('tickets', 100),
        safeFetch('audit_logs', 100),
        safeFetch('riders', 100),
      ]);
      setSummary(portalSummary);
      setOrders(orderRows);
      setApprovals(approvalRows);
      setTickets(ticketRows);
      setAuditLogs(auditRows);
      setRiders(riderRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load supervisor workspace.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { void reload(); }, [user?.id, user?.role]);

  const approvalQueue = useMemo(
    () => approvals.filter((r) => !['approved','completed','closed'].includes(String(r.status ?? '').toLowerCase())),
    [approvals],
  );

  const slaRiskOrders = useMemo(
    () => orders.filter((r) => ['sla_risk','delayed','late'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())),
    [orders],
  );

  const failedDeliveries = useMemo(
    () => orders.filter((r) => ['failed','failed_delivery'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())),
    [orders],
  );

  const escalations = useMemo(
    () => tickets.filter((r) => ['escalated','urgent','high'].includes(String(r.priority ?? r.status ?? '').toLowerCase())),
    [tickets],
  );

  return {
    summary,
    orders,
    approvals,
    tickets,
    auditLogs,
    riders,
    busy,
    error,
    reload,
    approvalQueue,
    slaRiskOrders,
    failedDeliveries,
    escalations,
  };
}
