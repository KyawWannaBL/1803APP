import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

type Props = {
  name: string;
  description: string;
  route: string;
  count: number;
};

export function PortalCard({ name, description, route, count }: Props) {
  const { t } = useI18n();

  return (
    <Link to={route} className="portal-card">
      <div className="portal-card__header">
        <div>
          <div className="portal-card__title">{name}</div>
          <div className="portal-card__description">{description}</div>
        </div>
        <span className="badge">{count}</span>
      </div>

      <div className="portal-card__footer">
        <span>{t('common.openPortal', 'Open Portal')}</span>
        <span>→</span>
      </div>
    </Link>
  );
}
