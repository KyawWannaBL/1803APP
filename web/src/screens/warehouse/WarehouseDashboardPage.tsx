import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { useI18n } from '@/i18n/I18nProvider';
import { KpiStrip } from '@/components/KpiStrip';
import { fetchPortalSummary, fetchWarehouseWorkspace, type GenericRecord } from '@/services/repositories';

export function WarehouseDashboardPage() {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const [summary, setSummary] = useState({
    totalOrders: 0,
    activeTasks: 0,
    openTickets: 0,
    inboundManifests: 0,
    outboundManifests: 0,
    notifications: 0,
  });
  const [workspace, setWorkspace] = useState({
    inbound: [] as GenericRecord[],
    outbound: [] as GenericRecord[],
    putaway: [] as GenericRecord[],
    inventory: [] as GenericRecord[],
    lanes: [] as GenericRecord[],
    locations: [] as GenericRecord[],
  });

  useEffect(() => {
    async function load() {
      const [portalSummary, warehouseWorkspace] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'WHM'),
        fetchWarehouseWorkspace(),
      ]);
      setSummary(portalSummary);
      setWorkspace(warehouseWorkspace);
    }
    void load();
  }, [user?.role]);

  const inboundOpen = useMemo(() => workspace.inbound.filter((row) => ['draft', 'receiving', 'staged'].includes(String(row.status))), [workspace.inbound]);
  const outboundOpen = useMemo(() => workspace.outbound.filter((row) => ['draft', 'loading', 'loaded'].includes(String(row.status))), [workspace.outbound]);

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.warehouse', 'Warehouse')}</div>
        <h1>{t('common.warehouseDashboard', 'Warehouse Dashboard')}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated workspace for inbound receiving, staging, inventory visibility, outbound loading, and dispatch handover.'
            : 'Inbound receiving၊ staging၊ inventory visibility၊ outbound loading နှင့် dispatch handover အတွက် dedicated workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.todayFocus', 'Today Focus')}</div>
              <h2>{t('common.currentWarehouseWorkload', 'Current Warehouse Workload')}</h2>
            </div>
          </div>

          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.inboundQueue', 'Inbound Queue')}</strong><span>{inboundOpen.length}</span></div>
            <div className="focus-item"><strong>{t('common.outboundQueue', 'Outbound Queue')}</strong><span>{outboundOpen.length}</span></div>
            <div className="focus-item"><strong>{t('common.putawayTasks', 'Putaway Tasks')}</strong><span>{workspace.putaway.length}</span></div>
            <div className="focus-item"><strong>{t('common.inventorySnapshots', 'Inventory Snapshots')}</strong><span>{workspace.inventory.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.quickAccess', 'Quick Access')}</div>
              <h2>{t('common.warehouseActions', 'Warehouse Actions')}</h2>
            </div>
          </div>

          <div className="quick-link-list">
            <Link to="/warehouse/inbound-manifest" className="quick-link-card"><div className="quick-link-card__title">{t('common.inboundManifest', 'Inbound Manifest')}</div></Link>
            <Link to="/warehouse/receiving-bay" className="quick-link-card"><div className="quick-link-card__title">{t('common.receivingBay', 'Receiving Bay')}</div></Link>
            <Link to="/warehouse/cargo-receiving-scan" className="quick-link-card"><div className="quick-link-card__title">{t('common.cargoReceivingScan', 'Cargo Receiving Scan')}</div></Link>
            <Link to="/warehouse/outbound-manifest" className="quick-link-card"><div className="quick-link-card__title">{t('common.outboundManifest', 'Outbound Manifest')}</div></Link>
            <Link to="/warehouse/dispatch-handover" className="quick-link-card"><div className="quick-link-card__title">{t('common.dispatchHandover', 'Dispatch Handover')}</div></Link>
          </div>
        </section>
      </div>
    </section>
  );
}
