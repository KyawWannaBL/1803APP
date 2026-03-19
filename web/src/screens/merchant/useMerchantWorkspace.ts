import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

type PortalSummary = { totalOrders: number; activeTasks: number; openTickets: number; inboundManifests: number; outboundManifests: number; notifications: number };
const defaultSummary: PortalSummary = { totalOrders: 0, activeTasks: 0, openTickets: 0, inboundManifests: 0, outboundManifests: 0, notifications: 0 };

async function safeFetch(table: string, limit = 100) { try { return await fetchDataset(table, limit); } catch { return []; } }

export function useMerchantWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [invoices, setInvoices] = useState<GenericRecord[]>([]);
  const [returns, setReturns] = useState<GenericRecord[]>([]);
  const [branches, setBranches] = useState<GenericRecord[]>([]);
  const [merchantUsers, setMerchantUsers] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, invoiceRows, returnRows, branchRows, userRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'MER'),
        safeFetch('orders', 100),
        safeFetch('invoices', 100),
        safeFetch('returns', 100),
        safeFetch('branches', 100),
        safeFetch('users', 100),
      ]);
      setSummary(portalSummary);
      setOrders(orderRows);
      setInvoices(invoiceRows);
      setReturns(returnRows);
      setBranches(branchRows);
      setMerchantUsers(userRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load merchant workspace.');
    } finally { setBusy(false); }
  }

  useEffect(() => { void reload(); }, [user?.id, user?.role]);

  const activeOrders = useMemo(() => orders.filter((r) => !['delivered','cancelled','returned'].includes(String(r.status_code ?? r.status ?? ''))), [orders]);
  const pendingReturns = useMemo(() => returns.filter((r) => !['completed','closed'].includes(String(r.status ?? ''))), [returns]);

  return { summary, orders, invoices, returns, branches, merchantUsers, busy, error, reload, activeOrders, pendingReturns };
}
