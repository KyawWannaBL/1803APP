import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { TimelinePanel } from '@/components/TimelinePanel';
import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';

export function SupervisorDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, approvalQueue, slaRiskOrders, failedDeliveries, escalations, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.supervisor', 'Supervisor')}</div>
        <h1>{locale === 'en' ? 'Supervisor Dashboard' : 'Supervisor Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated governance workspace for approval gates, SLA oversight, failed delivery review, escalation handling, audit monitoring, and performance supervision.'
            : 'approval gates၊ SLA oversight၊ failed delivery review၊ escalation handling၊ audit monitoring နှင့် performance supervision အတွက် dedicated governance workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.approvalQueue', 'Approval Queue')}</strong><span>{approvalQueue.length}</span></div>
            <div className="focus-item"><strong>{t('common.slaRisk', 'SLA Risk')}</strong><span>{slaRiskOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.failedDeliveries', 'Failed Deliveries')}</strong><span>{failedDeliveries.length}</span></div>
            <div className="focus-item"><strong>{t('common.escalations', 'Escalations')}</strong><span>{escalations.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/supervisor/approval-queue" className="quick-link-card"><div className="quick-link-card__title">{t('common.approvalQueue', 'Approval Queue')}</div></Link>
            <Link to="/supervisor/sla-risk" className="quick-link-card"><div className="quick-link-card__title">{t('common.slaRisk', 'SLA Risk')}</div></Link>
            <Link to="/supervisor/failed-deliveries" className="quick-link-card"><div className="quick-link-card__title">{t('common.failedDeliveries', 'Failed Deliveries')}</div></Link>
            <Link to="/supervisor/escalations" className="quick-link-card"><div className="quick-link-card__title">{t('common.escalations', 'Escalations')}</div></Link>
            <Link to="/supervisor/team-performance" className="quick-link-card"><div className="quick-link-card__title">{t('common.teamPerformance', 'Team Performance')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <TimelinePanel />
        {busy ? <div className="empty-state">{t('common.loading', 'Loading...')}</div> : null}
      </section>
    </section>
  );
}
