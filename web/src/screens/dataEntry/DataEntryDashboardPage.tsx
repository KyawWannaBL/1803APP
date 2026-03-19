import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { TimelinePanel } from '@/components/TimelinePanel';
import { useDataEntryWorkspace } from '@/screens/dataEntry/useDataEntryWorkspace';

export function DataEntryDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, orders, draftOrders, validationIssues, approvals, busy, error } = useDataEntryWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.dataEntry', 'Data Entry')}</div>
        <h1>{locale === 'en' ? 'Data Entry Dashboard' : 'Data Entry Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated intake workspace for shipment registration, validation review, approval submission, QR-ready intake, address verification, and workflow monitoring.'
            : 'shipment registration၊ validation review၊ approval submission၊ QR-ready intake၊ address verification နှင့် workflow monitoring အတွက် dedicated intake workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
            <div className="focus-item"><strong>{t('common.draftOrders', 'Draft Orders')}</strong><span>{draftOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.validationIssues', 'Validation Issues')}</strong><span>{validationIssues.length}</span></div>
            <div className="focus-item"><strong>{t('common.approvals', 'Approvals')}</strong><span>{approvals.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/data-entry/create-shipment" className="quick-link-card"><div className="quick-link-card__title">{t('common.createShipment', 'Create Shipment')}</div></Link>
            <Link to="/data-entry/draft-orders" className="quick-link-card"><div className="quick-link-card__title">{t('common.draftOrders', 'Draft Orders')}</div></Link>
            <Link to="/data-entry/bulk-upload" className="quick-link-card"><div className="quick-link-card__title">{t('common.bulkUpload', 'Bulk Upload')}</div></Link>
            <Link to="/data-entry/validation-results" className="quick-link-card"><div className="quick-link-card__title">{t('common.validationResults', 'Validation Results')}</div></Link>
            <Link to="/data-entry/submit-approval" className="quick-link-card"><div className="quick-link-card__title">{t('common.submitForApproval', 'Submit for Approval')}</div></Link>
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
