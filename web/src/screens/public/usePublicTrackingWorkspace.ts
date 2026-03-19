import { useEffect, useMemo, useState } from 'react';
import { fetchDataset, type GenericRecord } from '@/services/repositories';

export function usePublicTrackingWorkspace(query: string) {
  const [orders, setOrders] = useState<GenericRecord[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setBusy(true);
      setError('');
      try {
        const rows = await fetchDataset('orders', 100);
        setOrders(rows);
      } catch (e: any) {
        setError(e?.message ?? 'Unable to load tracking records.');
      } finally {
        setBusy(false);
      }
    }
    void load();
  }, []);

  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return [];
    return orders.filter((row) => {
      const hay = `${row.order_code ?? ''} ${row.reference_no ?? ''} ${row.tracking_no ?? ''} ${row.awb_no ?? ''}`.toLowerCase();
      return hay.includes(normalized);
    });
  }, [normalized, orders]);

  const firstResult = results[0] ?? null;

  return { orders, results, firstResult, busy, error };
}
