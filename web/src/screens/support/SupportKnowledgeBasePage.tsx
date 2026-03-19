import { useI18n } from '@/i18n/I18nProvider';
import { useSupportWorkspace } from '@/screens/support/useSupportWorkspace';

export function SupportKnowledgeBasePage() {
  const { t } = useI18n();
  const { knowledge, busy, error } = useSupportWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.knowledgeBase', 'Knowledge Base')}</div>
        <h1>{t('common.knowledgeBase', 'Knowledge Base')}</h1>
        <p>{t('common.knowledgeBaseWorkflowNote', 'Review support guidance articles, templates, and reusable operational answers.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.article', 'Article')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.category', 'Category')}</th></tr></thead><tbody>{knowledge.length ? knowledge.map((row) => <tr key={String(row.id)}><td>{row.title ?? row.name ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.category ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
