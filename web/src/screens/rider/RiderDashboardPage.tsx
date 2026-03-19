import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { useI18n } from '@/i18n/I18nProvider';
import { KpiStrip } from '@/components/KpiStrip';
import { fetchPortalSummary, fetchRiderWorkspace, type GenericRecord } from '@/services/repositories';

export function RiderDashboardPage() {
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
  const [tasks, setTasks] = useState<GenericRecord[]>([]);

  useEffect(() => {
    async function load() {
      const [portalSummary, riderWorkspace] = await Promise.all([
        fetchPortalSummary(user?.role ?? 'RID'),
        fetchRiderWorkspace(user?.id),
      ]);
      setSummary(portalSummary);
      setTasks(riderWorkspace.tasks);
    }
    void load();
  }, [user?.id, user?.role]);

  const active = useMemo(() => tasks.filter((row) => ['assigned', 'accepted', 'picked_up', 'in_transit'].includes(String(row.status))), [tasks]);
  const completed = useMemo(() => tasks.filter((row) => String(row.status) === 'delivered'), [tasks]);

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.execution', 'Execution')}</div>
        <h1>{t('common.riderDashboard', 'Rider Dashboard')}</h1>
        <p>
          {locale === 'en'
            ? 'Focused workspace for assigned tasks, pickup execution, delivery completion, and issue reporting.'
            : 'Assigned tasks၊ pickup execution၊ delivery completion နှင့် issue reporting အတွက် rider workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.todayFocus', 'Today Focus')}</div>
              <h2>{t('common.currentWorkload', 'Current Workload')}</h2>
            </div>
          </div>

          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.activeTasks', 'Active Tasks')}</strong><span>{active.length}</span></div>
            <div className="focus-item"><strong>{t('common.completed', 'Completed')}</strong><span>{completed.length}</span></div>
            <div className="focus-item"><strong>{t('common.assignedTasks', 'Assigned Tasks')}</strong><span>{tasks.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.quickAccess', 'Quick Access')}</div>
              <h2>{t('common.riderActions', 'Rider Actions')}</h2>
            </div>
          </div>

          <div className="quick-link-list">
            <Link to="/rider/assigned-tasks" className="quick-link-card"><div className="quick-link-card__title">{t('common.assignedTasks', 'Assigned Tasks')}</div></Link>
            <Link to="/rider/pickup" className="quick-link-card"><div className="quick-link-card__title">{t('common.confirmPickup', 'Confirm Pickup')}</div></Link>
            <Link to="/rider/delivery" className="quick-link-card"><div className="quick-link-card__title">{t('common.completeDelivery', 'Complete Delivery')}</div></Link>
            <Link to="/rider/incidents" className="quick-link-card"><div className="quick-link-card__title">{t('common.reportIncident', 'Report Incident')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="section-header">
          <div>
            <div className="section-header__eyebrow">{t('common.nextStops', 'Next Stops')}</div>
            <h2>{t('common.assignedTasks', 'Assigned Tasks')}</h2>
          </div>
          <Link className="toolbar-button toolbar-button--primary" to="/rider/assigned-tasks">
            {t('common.openTasks', 'Open Tasks')}
          </Link>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.taskCode', 'Task Code')}</th>
                <th>{t('common.type', 'Type')}</th>
                <th>{t('common.status', 'Status')}</th>
                <th>{t('common.order', 'Order')}</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length ? tasks.slice(0, 8).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.task_code ?? row.id}</td>
                  <td>{row.task_type ?? '-'}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.order_id ?? '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
