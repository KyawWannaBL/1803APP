import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

type PortalSummary = { totalOrders: number; activeTasks: number; openTickets: number; inboundManifests: number; outboundManifests: number; notifications: number };
const defaultSummary: PortalSummary = { totalOrders: 0, activeTasks: 0, openTickets: 0, inboundManifests: 0, outboundManifests: 0, notifications: 0 };

async function safeFetch(table: string, limit = 100) { try { return await fetchDataset(table, limit); } catch { return []; } }

export function useCustomerWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [tickets, setTickets] = useState<GenericRecord[]>([]);
  const [profiles, setProfiles] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, ticketRows, profileRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'CUS'),
        safeFetch('orders', 100),
        safeFetch('tickets', 100),
        safeFetch('customers', 100),
      ]);
      setSummary(portalSummary);
      setOrders(orderRows);
      setTickets(ticketRows);
      setProfiles(profileRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load customer workspace.');
    } finally { setBusy(false); }
  }

  useEffect(() => { void reload(); }, [user?.id, user?.role]);

  const activeOrders = useMemo(() => orders.filter((r) => !['delivered','cancelled','returned'].includes(String(r.status_code ?? r.status ?? ''))), [orders]);

  return { summary, orders, tickets, profiles, busy, error, reload, activeOrders };
}
