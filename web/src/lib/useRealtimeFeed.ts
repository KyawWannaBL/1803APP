import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';

export type FeedEvent = {
  id: string;
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
};

const seedFeed: FeedEvent[] = [
  { id: 'evt-1', title: 'Dispatch checkpoint', detail: 'Hub outbound manifest moved to loading.', severity: 'info', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: 'evt-2', title: 'SLA risk detected', detail: 'Three orders crossed the 45 minute idle threshold.', severity: 'warning', createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: 'evt-3', title: 'Exception alert', detail: 'Vehicle telemetry stopped for route RGN-09.', severity: 'critical', createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
];

export function useRealtimeFeed() {
  const [events, setEvents] = useState<FeedEvent[]>(seedFeed);
  const [status, setStatus] = useState<'demo' | 'live' | 'offline'>(
    supabase && !env.enableDemoFallback ? 'live' : 'demo',
  );

  useEffect(() => {
    if (!supabase || env.enableDemoFallback) {
      const interval = window.setInterval(() => {
        setEvents((current) => {
          const next = {
            id: `evt-${Date.now()}`,
            title: 'Demo heartbeat',
            detail: 'Live operations heartbeat event received from demo channel.',
            severity: 'info' as const,
            createdAt: new Date().toISOString(),
          };
          return [next, ...current].slice(0, 8);
        });
      }, 25000);
      return () => window.clearInterval(interval);
    }

    setStatus('live');

    const channel = supabase
      .channel('enterprise-live-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipment_tracking' }, (payload) => {
        const event: FeedEvent = {
          id: String(payload.commit_timestamp ?? Date.now()),
          title: 'Shipment tracking update',
          detail: `Realtime update received for shipment tracking (${payload.eventType}).`,
          severity: payload.eventType === 'DELETE' ? 'warning' : 'info',
          createdAt: new Date().toISOString(),
        };
        setEvents((current) => [event, ...current].slice(0, 8));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, (payload) => {
        const event: FeedEvent = {
          id: `ticket-${payload.commit_timestamp ?? Date.now()}`,
          title: 'Support event',
          detail: `Support ticket event ${payload.eventType.toLowerCase()} received.`,
          severity: payload.eventType === 'INSERT' ? 'warning' : 'info',
          createdAt: new Date().toISOString(),
        };
        setEvents((current) => [event, ...current].slice(0, 8));
      })
      .subscribe((subscriptionStatus) => {
        if (subscriptionStatus === 'CHANNEL_ERROR') setStatus('offline');
        if (subscriptionStatus === 'SUBSCRIBED') setStatus('live');
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const metrics = useMemo(() => {
    const critical = events.filter((event) => event.severity === 'critical').length;
    const warning = events.filter((event) => event.severity === 'warning').length;
    return { critical, warning, total: events.length };
  }, [events]);

  return { events, metrics, status };
}