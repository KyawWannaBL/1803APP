import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';
import { MapboxPanel } from '@/components/MapboxPanel';

export function SupervisorSlaRiskPage() {
  const { t } = useI18n();
  const { slaRiskOrders, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.slaRisk', 'SLA Risk')}</div>
        <h1>{t('common.slaRisk', 'SLA Risk')}</h1>
        <p>{t('common.slaRiskWorkflowNote', 'Review delayed and at-risk deliveries with route-level visibility and escalation readiness.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="page-grid">
        <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{slaRiskOrders.length ? slaRiskOrders.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
        <section className="page-card"><h2>{t('common.routeVisibility', 'Route Visibility')}</h2><MapboxPanel /></section>
      </div>
    </section>
  );
}
