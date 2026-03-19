import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsRiderAvailabilityPage() {
  const { t } = useI18n();
  const { riders, tasks, error } = useOperationsWorkspace();

  const rows = useMemo(() => {
    return riders.map((rider) => {
      const riderId = String(rider.id ?? rider.rider_id ?? '');
      const load = tasks.filter((row) => String(row.assigned_rider_id ?? '') === riderId && ['assigned','accepted','picked_up','in_transit'].includes(String(row.status))).length;
      return { rider, load };
    });
  }, [riders, tasks]);

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.riderAvailability', 'Rider Availability')}</div>
        <h1>{t('common.riderAvailability', 'Rider Availability')}</h1>
        <p>{t('common.riderAvailabilityWorkflowNote', 'Use this board to review rider status, current task load, and assignment readiness.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.rider', 'Rider')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.branch', 'Branch')}</th><th>{t('common.currentLoad', 'Current Load')}</th></tr></thead>
            <tbody>
              {rows.length ? rows.map((item) => (
                <tr key={String(item.rider.id ?? item.rider.rider_id)}>
                  <td>{item.rider.name ?? item.rider.full_name ?? item.rider.rider_code ?? '-'}</td>
                  <td>{item.rider.status ?? item.rider.availability_status ?? '-'}</td>
                  <td>{item.rider.branch_id ?? item.rider.branch_name ?? '-'}</td>
                  <td>{item.load}</td>
                </tr>
              )) : <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
