import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, newOrders, unassignedTasks, inTransitTasks, failedTasks, tickets, busy, error } = useOperationsWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.operations', 'Operations')}</div>
        <h1>{locale === 'en' ? 'Operations Dashboard' : 'Operations Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Production dispatch workspace for daily control, assignment oversight, SLA monitoring, and exception management.'
            : 'နေ့စဉ် control၊ assignment oversight၊ SLA monitoring နှင့် exception management အတွက် production dispatch workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.todayFocus', 'Today Focus')}</div>
              <h2>{locale === 'en' ? 'Dispatch Health' : 'Dispatch Health'}</h2>
            </div>
          </div>
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.newOrders', 'New Orders')}</strong><span>{newOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.assignmentQueue', 'Assignment Queue')}</strong><span>{unassignedTasks.length}</span></div>
            <div className="focus-item"><strong>{t('common.inTransit', 'In Transit')}</strong><span>{inTransitTasks.length}</span></div>
            <div className="focus-item"><strong>{t('common.failedDeliveries', 'Failed Deliveries')}</strong><span>{failedTasks.length}</span></div>
            <div className="focus-item"><strong>{t('common.escalations', 'Escalations')}</strong><span>{tickets.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.quickAccess', 'Quick Access')}</div>
              <h2>{locale === 'en' ? 'Operations Actions' : 'Operations Actions'}</h2>
            </div>
          </div>
          <div className="quick-link-list">
            <Link to="/operations/control-room" className="quick-link-card"><div className="quick-link-card__title">{t('common.controlRoom', 'Control Room')}</div></Link>
            <Link to="/operations/new-orders" className="quick-link-card"><div className="quick-link-card__title">{t('common.newOrders', 'New Orders')}</div></Link>
            <Link to="/operations/assignment-workbench" className="quick-link-card"><div className="quick-link-card__title">{t('common.assignmentWorkbench', 'Assignment Workbench')}</div></Link>
            <Link to="/operations/sla-risk-board" className="quick-link-card"><div className="quick-link-card__title">{t('common.slaRiskBoard', 'SLA Risk Board')}</div></Link>
            <Link to="/operations/failed-deliveries" className="quick-link-card"><div className="quick-link-card__title">{t('common.failedDeliveries', 'Failed Deliveries')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="section-header">
          <div>
            <div className="section-header__eyebrow">{t('common.assignmentQueue', 'Assignment Queue')}</div>
            <h2>{t('common.unassignedTasks', 'Unassigned Tasks')}</h2>
          </div>
          <Link to="/operations/assignment-workbench" className="toolbar-button toolbar-button--primary">
            {t('common.openAssignmentWorkbench', 'Open Assignment Workbench')}
          </Link>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.taskCode', 'Task Code')}</th><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.type', 'Type')}</th></tr></thead>
            <tbody>
              {unassignedTasks.length ? unassignedTasks.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.task_code ?? row.id}</td>
                  <td>{row.order_id ?? '-'}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.task_type ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
