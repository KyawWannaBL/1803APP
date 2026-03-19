import { MapboxPanel } from '@/components/MapboxPanel';
import { TimelinePanel } from '@/components/TimelinePanel';
import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsControlRoomPage() {
  const { t, locale } = useI18n();
  const { newOrders, unassignedTasks, inTransitTasks, failedTasks, tickets, tracking, error } = useOperationsWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.controlRoom', 'Control Room')}</div>
        <h1>{t('common.controlRoom', 'Control Room')}</h1>
        <p>
          {locale === 'en'
            ? 'Live operational overview for dispatch health, in-transit visibility, escalation signals, and exception response.'
            : 'Dispatch health၊ in-transit visibility၊ escalation signals နှင့် exception response ကို တိုက်ရိုက်ကြည့်ရှုနိုင်သော live operational overview ဖြစ်ပါသည်။'}
        </p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.newOrders', 'New Orders')}</strong><span>{newOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.assignmentQueue', 'Assignment Queue')}</strong><span>{unassignedTasks.length}</span></div>
            <div className="focus-item"><strong>{t('common.inTransit', 'In Transit')}</strong><span>{inTransitTasks.length}</span></div>
            <div className="focus-item"><strong>{t('common.failedDeliveries', 'Failed Deliveries')}</strong><span>{failedTasks.length}</span></div>
            <div className="focus-item"><strong>{t('common.escalations', 'Escalations')}</strong><span>{tickets.length}</span></div>
            <div className="focus-item"><strong>{t('common.trackingEvents', 'Tracking Events')}</strong><span>{tracking.length}</span></div>
          </div>
        </section>
        <section className="page-main-stack">
          <section className="page-card"><MapboxPanel /></section>
          <section className="page-card"><TimelinePanel /></section>
        </section>
      </div>
    </section>
  );
}
