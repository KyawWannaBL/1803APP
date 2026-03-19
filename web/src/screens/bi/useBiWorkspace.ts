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

export function useBiWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [riders, setRiders] = useState<GenericRecord[]>([]);
  const [merchants, setMerchants] = useState<GenericRecord[]>([]);
  const [invoices, setInvoices] = useState<GenericRecord[]>([]);
  const [tickets, setTickets] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, riderRows, merchantRows, invoiceRows, ticketRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'EA'),
        safeFetch('orders', 200),
        safeFetch('riders', 100),
        safeFetch('merchants', 100),
        safeFetch('invoices', 100),
        safeFetch('tickets', 100),
      ]);
      setSummary(portalSummary);
      setOrders(orderRows);
      setRiders(riderRows);
      setMerchants(merchantRows);
      setInvoices(invoiceRows);
      setTickets(ticketRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load BI workspace.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [user?.id, user?.role]);

  const deliveredOrders = useMemo(() => orders.filter((r) => String(r.status_code ?? r.status ?? '').toLowerCase() === 'delivered'), [orders]);
  const failedOrders = useMemo(() => orders.filter((r) => String(r.status_code ?? r.status ?? '').toLowerCase().includes('failed')), [orders]);
  const slaRiskOrders = useMemo(() => orders.filter((r) => ['sla_risk','delayed','late'].includes(String(r.status_code ?? r.status ?? '').toLowerCase())), [orders]);
  const revenueInvoices = useMemo(() => invoices.filter((r) => !['cancelled','void'].includes(String(r.status ?? '').toLowerCase())), [invoices]);
  const escalatedTickets = useMemo(() => tickets.filter((r) => ['escalated','high','urgent'].includes(String(r.priority ?? r.status ?? '').toLowerCase())), [tickets]);

  return {
    summary,
    orders,
    riders,
    merchants,
    invoices,
    tickets,
    busy,
    error,
    reload,
    deliveredOrders,
    failedOrders,
    slaRiskOrders,
    revenueInvoices,
    escalatedTickets,
  };
}
