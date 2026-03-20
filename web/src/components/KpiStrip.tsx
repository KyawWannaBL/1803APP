type Props = {
  metrics: Record<string, number | string | null | undefined>;
  variant?: 'default' | 'premium';
};

export function KpiStrip({ metrics, variant = 'default' }: Props) {
  const entries = Object.entries(metrics).filter(([key]) => key !== 'role');
  return (
    <div className={`kpi-strip ${variant === 'premium' ? 'kpi-strip--premium' : ''}`}>
      {entries.map(([key, value]) => (
        <div key={key} className="kpi-card">
          <div className="kpi-card__icon">{key.slice(0, 1).toUpperCase()}</div>
          <div className="kpi-card__label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
          <div className="kpi-card__value">{value ?? 0}</div>
        </div>
      ))}
    </div>
  );
}