import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export function CustomerPreferencesPage() {
  const { t } = useI18n();
  const [message, setMessage] = useState('');

  function savePreferences() {
    setMessage(t('common.preferencesSavedPrepared', 'Preferences screen prepared. Connect this action to your customer settings repository endpoint.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.preferences', 'Preferences')}</div>
        <h1>{t('common.preferences', 'Preferences')}</h1>
        <p>{t('common.preferencesWorkflowNote', 'Manage your language and notification preferences for customer-facing services.')}</p>
      </article>
      <section className="page-card">
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={savePreferences}>{t('common.save', 'Save')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
