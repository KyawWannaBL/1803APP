import { useI18n } from '@/i18n/I18nProvider';
import { useBranchOfficeWorkspace } from '@/screens/branchOffice/useBranchOfficeWorkspace';

export function BranchOfficeReportsPage() {
  const { t } = useI18n();
  const { orders, localExceptions, riders, busy, error } = useBranchOfficeWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.reports', 'Reports')}</div>
        <h1>{t('common.reports', 'Reports')}</h1>
        <p>{t('common.branchReportsWorkflowNote', 'Review branch-level totals for orders, exceptions, and local rider coverage.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <div className="focus-list">
          <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
          <div className="focus-item"><strong>{t('common.exceptions', 'Exceptions')}</strong><span>{localExceptions.length}</span></div>
          <div className="focus-item"><strong>{t('common.riders', 'Riders')}</strong><span>{riders.length}</span></div>
        </div>
        {busy ? <div className="empty-state">{t('common.loading', 'Loading...')}</div> : null}
      </section>
    </section>
  );
}
