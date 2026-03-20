import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import screenCatalogRaw from '@/data/screenCatalog.json';
import { useI18n } from '@/i18n/I18nProvider';
import { MapboxPanel } from '@/components/MapboxPanel';
import { QRScanPanel } from '@/components/QRScanPanel';
import { SignaturePanel } from '@/components/SignaturePanel';
import { TimelinePanel } from '@/components/TimelinePanel';
import { KpiStrip } from '@/components/KpiStrip';
import { DatasetPanel } from '@/components/DataSetPanel';
import { WorkflowGatePanel } from '@/components/WorkflowGatePanel';
import { fetchPortalSummary, fetchScreenDatasets, getPrimaryEntityType, type GenericRecord } from '@/services/repositories';
import type { WorkflowEntityType } from '@/services/workflowService';
import { useAuth } from '@/auth/AuthProvider';
import type { ScreenCatalogEntry } from '@/types';

type PortalSummary = { totalOrders: number; activeTasks: number; openTickets: number; inboundManifests: number; outboundManifests: number; notifications: number };
const defaultSummary: PortalSummary = { totalOrders: 0, activeTasks: 0, openTickets: 0, inboundManifests: 0, outboundManifests: 0, notifications: 0 };
const screenCatalog = screenCatalogRaw as ScreenCatalogEntry[];

const riderMap = (s: ScreenCatalogEntry) => s.route.toLowerCase().includes('pickup') ? '/rider/pickup' : s.route.toLowerCase().includes('delivery') ? '/rider/delivery' : s.route.toLowerCase().includes('incident') ? '/rider/incidents' : s.route.toLowerCase().includes('task') || s.route.toLowerCase().includes('assigned') ? '/rider/assigned-tasks' : '/rider/dashboard';
const warehouseMap = (s: ScreenCatalogEntry) => { const k = `${s.route} ${s.code} ${s.title_en}`.toLowerCase(); if (k.includes('receiving-bay')) return '/warehouse/receiving-bay'; if (k.includes('scan')) return '/warehouse/cargo-receiving-scan'; if (k.includes('damage') || k.includes('shortage')) return '/warehouse/shortage-damage-entry'; if (k.includes('vehicle')) return '/warehouse/vehicle-load-verification'; if (k.includes('load confirmation')) return '/warehouse/load-confirmation'; if (k.includes('handover')) return '/warehouse/dispatch-handover'; if (k.includes('outbound')) return '/warehouse/outbound-manifest'; if (k.includes('inbound')) return '/warehouse/inbound-manifest'; return '/warehouse/dashboard'; };
const operationsMap = (s: ScreenCatalogEntry) => { const k = `${s.route} ${s.code} ${s.title_en}`.toLowerCase(); if (k.includes('control')) return '/operations/control-room'; if (k.includes('assignment')) return '/operations/assignment-workbench'; if (k.includes('availability')) return '/operations/rider-availability'; if (k.includes('transit') || k.includes('lifecycle')) return '/operations/in-transit-board'; if (k.includes('sla') || k.includes('risk')) return '/operations/sla-risk-board'; if (k.includes('failed')) return '/operations/failed-deliveries'; if (k.includes('return')) return '/operations/returns'; if (k.includes('escalat')) return '/operations/escalations'; if (k.includes('shipment') || k.includes('order')) return '/operations/new-orders'; return '/operations/dashboard'; };
const financeMap = (s: ScreenCatalogEntry) => { const k = `${s.route} ${s.code} ${s.title_en}`.toLowerCase(); if (k.includes('cod')) return '/finance/cod-reconciliation'; if (k.includes('settlement')) return '/finance/settlement-queue'; if (k.includes('invoice')) return '/finance/invoices'; if (k.includes('payment')) return '/finance/payment-records'; if (k.includes('payout')) return '/finance/rider-payouts'; if (k.includes('ledger')) return '/finance/merchant-ledger'; if (k.includes('refund')) return '/finance/refund-review'; return '/finance/dashboard'; };
const supportMap = (s: ScreenCatalogEntry) => { const k = `${s.route} ${s.code} ${s.title_en}`.toLowerCase(); if (k.includes('ticket') || k.includes('inbox')) return '/support/ticket-inbox'; if (k.includes('order')) return '/support/order-search'; if (k.includes('history')) return '/support/customer-history'; if (k.includes('complaint')) return '/support/complaint-logging'; if (k.includes('escalat')) return '/support/escalation-queue'; if (k.includes('knowledge') || k.includes('template')) return '/support/knowledge-base'; return '/support/dashboard'; };
const merchantMap = (s: ScreenCatalogEntry) => { const k = `${s.route} ${s.code} ${s.title_en}`.toLowerCase(); if (k.includes('create')) return '/merchant/create-order'; if (k.includes('bulk')) return '/merchant/bulk-upload'; if (k.includes('order')) return '/merchant/orders'; if (k.includes('tracking') || k.includes('track')) return '/merchant/tracking'; if (k.includes('return')) return '/merchant/returns'; if (k.includes('invoice') || k.includes('billing')) return '/merchant/invoices'; if (k.includes('setting') || k.includes('profile') || k.includes('branch') || k.includes('user')) return '/merchant/settings'; return '/merchant/dashboard'; };
const customerMap = (s: ScreenCatalogEntry) => { const k = `${s.route} ${s.code} ${s.title_en}`.toLowerCase(); if (k.includes('create') || k.includes('request')) return '/customer/create-request'; if (k.includes('order')) return '/customer/orders'; if (k.includes('tracking') || k.includes('track')) return '/customer/tracking'; if (k.includes('ticket') || k.includes('support')) return '/customer/support-tickets'; if (k.includes('profile')) return '/customer/profile'; if (k.includes('preference') || k.includes('setting')) return '/customer/preferences'; return '/customer/dashboard'; };

export function ScreenPage() {
  const { pathname } = useLocation();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [datasets, setDatasets] = useState<Record<string, GenericRecord[]>>({});
  const [busy, setBusy] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GenericRecord | null>(null);

  const screen = useMemo<ScreenCatalogEntry | undefined>(() => screenCatalog.find((i) => i.route === pathname) ?? screenCatalog.find((i) => i.legacy_route === pathname), [pathname]);

  async function reload() {
    if (!screen) return;
    setBusy(true);
    try {
      const [portalSummary, screenDatasets] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'EA'),
        fetchScreenDatasets(screen, 12),
      ]);
      setSummary(portalSummary);
      setDatasets(screenDatasets);
      const first = screen.tables?.[0];
      setSelectedRecord(first ? (screenDatasets[first] ?? [])[0] ?? null : null);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [screen?.code, user?.role]);

  if (!screen) return <section className="page-card"><h1>{t('common.notFound', 'Not found')}</h1></section>;
  if (screen.portal === 'rider') return <Navigate to={riderMap(screen)} replace />;
  if (screen.portal === 'warehouse_hub_operations') return <Navigate to={warehouseMap(screen)} replace />;
  if (screen.portal === 'operations_dispatch') return <Navigate to={operationsMap(screen)} replace />;
  if (screen.portal === 'finance') return <Navigate to={financeMap(screen)} replace />;
  if (screen.portal === 'customer_support') return <Navigate to={supportMap(screen)} replace />;
  if (screen.portal === 'merchant') return <Navigate to={merchantMap(screen)} replace />;
  if (screen.portal === 'customer' || screen.portal === 'customer_portal') return <Navigate to={customerMap(screen)} replace />;

  const localizedTitle = t(`screens.${screen.code}.title`, locale === 'en' ? screen.title_en : screen.title_mm);
  const primary = screen.tables?.[0] ?? '';
  const entityType = primary ? getPrimaryEntityType(primary) : null;
  const showMap = ['dispatch','tracking','map'].some((k) => (screen.modules ?? []).includes(k)) || screen.route.includes('map');
  const showQr = screen.route.includes('qr') || screen.route.includes('scan') || screen.route.includes('label') || (screen.modules ?? []).includes('qr');
  const showSignature = screen.route.includes('signature') || screen.route.includes('pod') || screen.title_en.includes('Confirmation') || (screen.modules ?? []).includes('signature');

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="badge-row">
          <span className={`badge badge--${screen.kind}`}>{t(`screens.${screen.code}.kind`, screen.kind)}</span>
          <span className="badge">{t(`portals.${screen.portal}`, locale === 'en' ? screen.portal_name_en : screen.portal_name_mm)}</span>
          <span className="badge">{t(`menus.${screen.menu}`, screen.menu)}</span>
        </div>
        <h1>{localizedTitle}</h1>
        <KpiStrip metrics={summary} />
      </article>
      <div className="page-grid">
        <div className="page-main-stack">
          {screen.tables.slice(0,2).map((table) => (
            <DatasetPanel key={table} table={table} rows={datasets[table] ?? []} busy={busy} onReload={reload} selectedId={selectedRecord ? String(selectedRecord.id) : null} onSelect={setSelectedRecord} />
          ))}
          {entityType ? <WorkflowGatePanel entityType={entityType as WorkflowEntityType} record={selectedRecord} onTransitioned={reload} /> : null}
        </div>
        <aside className="widget-column">
          <TimelinePanel />
          {showMap ? <MapboxPanel /> : null}
          {showQr ? <QRScanPanel /> : null}
          {showSignature ? <SignaturePanel /> : null}
        </aside>
      </div>
    </section>
  );
}
