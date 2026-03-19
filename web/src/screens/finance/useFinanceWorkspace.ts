import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { fetchDataset, fetchPortalSummary, type GenericRecord } from '@/services/repositories';

type PortalSummary = { totalOrders: number; activeTasks: number; openTickets: number; inboundManifests: number; outboundManifests: number; notifications: number };
const defaultSummary: PortalSummary = { totalOrders: 0, activeTasks: 0, openTickets: 0, inboundManifests: 0, outboundManifests: 0, notifications: 0 };

async function safeFetch(table: string, limit = 100) { try { return await fetchDataset(table, limit); } catch { return []; } }

export function useFinanceWorkspace() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [invoices, setInvoices] = useState<GenericRecord[]>([]);
  const [settlements, setSettlements] = useState<GenericRecord[]>([]);
  const [payments, setPayments] = useState<GenericRecord[]>([]);
  const [payouts, setPayouts] = useState<GenericRecord[]>([]);
  const [ledger, setLedger] = useState<GenericRecord[]>([]);
  const [refunds, setRefunds] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    setBusy(true);
    setError('');
    try {
      const [portalSummary, orderRows, invoiceRows, settlementRows, paymentRows, payoutRows, ledgerRows, refundRows] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'FIN'),
        safeFetch('orders'), safeFetch('invoices'), safeFetch('settlements'), safeFetch('payment_records'),
        safeFetch('rider_payouts'), safeFetch('merchant_ledger_entries'), safeFetch('refunds'),
      ]);
      setSummary(portalSummary);
      setOrders(orderRows);
      setInvoices(invoiceRows);
      setSettlements(settlementRows);
      setPayments(paymentRows);
      setPayouts(payoutRows);
      setLedger(ledgerRows);
      setRefunds(refundRows);
    } catch (e: any) {
      setError(e?.message ?? 'Unable to load finance workspace.');
    } finally { setBusy(false); }
  }

  useEffect(() => { void reload(); }, [user?.id, user?.role]);

  const codOrders = useMemo(() => orders.filter((r) => Number(r.cod_amount ?? r.cod_collected_amount ?? 0) > 0), [orders]);
  const openSettlements = useMemo(() => settlements.filter((r) => !['settled','paid','closed'].includes(String(r.status ?? ''))), [settlements]);
  const unpaidInvoices = useMemo(() => invoices.filter((r) => !['paid','closed'].includes(String(r.status ?? ''))), [invoices]);

  return { summary, orders, invoices, settlements, payments, payouts, ledger, refunds, busy, error, reload, codOrders, openSettlements, unpaidInvoices };
}
