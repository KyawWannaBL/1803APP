import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';
import { QRScanPanel } from '@/components/QRScanPanel';

export function SupervisorFailedDeliveriesPage() {
  const { t } = useI18n();
  const { failedDeliveries, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.failedDeliveries', 'Failed Deliveries')}</div>
        <h1>{t('common.failedDeliveries', 'Failed Deliveries')}</h1>
        <p>{t('common.failedDeliveriesWorkflowNote', 'Review failed delivery cases, supporting evidence, and QR-linked shipment verification for reattempt or closure.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="page-grid">
        <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{failedDeliveries.length ? failedDeliveries.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
        <section className="page-card"><h2>{t('common.qrVerification', 'QR Verification')}</h2><QRScanPanel /></section>
      </div>
    </section>
  );
}
