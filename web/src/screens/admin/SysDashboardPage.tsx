import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { ActivityTimelineWidget } from '@/components/ActivityTimelineWidget';
import { TaskInboxPanel } from '@/components/TaskInboxPanel';
import { TelemetryRail } from '@/components/TelemetryRail';
import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function SysDashboardPage() {
  const { t } = useI18n();
  const { summary, organizations, branches, users } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero glass-card">
        <div className="page-eyebrow">System control</div>
        <h1>SYS Command Center</h1>
        <p>Global oversight for administration, operations, finance, merchant experience, and customer support.</p>
        <KpiStrip metrics={summary} variant="premium" />
      </article>

      <div className="page-grid page-grid--dashboard">
        <div className="page-main-stack">
          <TelemetryRail />
          <TaskInboxPanel userRole="SYS" />
          <section className="page-card glass-card">
            <div className="widget-card__title">Global launch controls</div>
            <div className="quick-link-list">
              <Link to="/super-admin/dashboard" className="quick-link-card"><div className="quick-link-card__title">Super Admin</div></Link>
              <Link to="/enterprise-admin/dashboard" className="quick-link-card"><div className="quick-link-card__title">Enterprise Admin</div></Link>
              <Link to="/operations/dashboard" className="quick-link-card"><div className="quick-link-card__title">Operations</div></Link>
              <Link to="/finance/dashboard" className="quick-link-card"><div className="quick-link-card__title">Finance</div></Link>
              <Link to="/support/dashboard" className="quick-link-card"><div className="quick-link-card__title">Support</div></Link>
              <Link to="/merchant/dashboard" className="quick-link-card"><div className="quick-link-card__title">Merchant</div></Link>
            </div>
          </section>
        </div>
        <aside className="widget-column">
          <ActivityTimelineWidget />
          <section className="widget-card glass-card">
            <div className="widget-card__title">Control metrics</div>
            <div className="focus-list">
              <div className="focus-item"><strong>{t('common.organizations', 'Organizations')}</strong><span>{organizations.length}</span></div>
              <div className="focus-item"><strong>{t('common.branches', 'Branches')}</strong><span>{branches.length}</span></div>
              <div className="focus-item"><strong>{t('common.users', 'Users')}</strong><span>{users.length}</span></div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

export default SysDashboardPage;