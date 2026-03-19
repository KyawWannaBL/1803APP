import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

type PortalSummary = { totalOrders: number; activeTasks: number; openTickets: number; inboundManifests: number; outboundManifests: number; notifications: number };
const defaultSummary: PortalSummary = { totalOrders: 0, activeTasks: 0, openTickets: 0, inboundManifests: 0, outboundManifests: 0, notifications: 0 };

async function safeFetch(table: string, limit = 100) { try { return await fetchDataset(table, limit); } catch { return []; } }

export function useSupportWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [tickets, setTickets] = useState<GenericRecord[]>([]);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [customers, setCustomers] = useState<GenericRecord[]>([]);
  const [knowledge, setKnowledge] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, ticketRows, orderRows, customerRows, knowledgeRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'SUP'),
        safeFetch('tickets', 100),
        safeFetch('orders', 100),
        safeFetch('customers', 100),
        safeFetch('knowledge_articles', 100),
      ]);
      setSummary(portalSummary);
      setTickets(ticketRows);
      setOrders(orderRows);
      setCustomers(customerRows);
      setKnowledge(knowledgeRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load support workspace.');
    } finally { setBusy(false); }
  }

  useEffect(() => { void reload(); }, [user?.id, user?.role]);

  const complaintTickets = useMemo(() => tickets.filter((r) => `${r.category ?? ''} ${r.type ?? ''} ${r.subject ?? ''}`.toLowerCase().includes('complaint')), [tickets]);
  const escalatedTickets = useMemo(() => tickets.filter((r) => ['escalated','high','urgent'].includes(String(r.priority ?? r.status ?? '').toLowerCase())), [tickets]);

  return { summary, tickets, orders, customers, knowledge, busy, error, reload, complaintTickets, escalatedTickets };
}
