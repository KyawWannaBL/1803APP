export function TelemetryRail() {
  const cards = [
    { label: 'Active riders', value: '42', detail: '12 on-route · 4 idle' },
    { label: 'Vehicles online', value: '18', detail: '2 low battery alerts' },
    { label: 'Exception alerts', value: '6', detail: '3 SLA · 2 geofence · 1 scan gap' },
  ];

  return (
    <section className="widget-card glass-card">
      <div className="widget-card__title">Realtime tracking & telemetry</div>
      <div className="telemetry-grid">
        {cards.map((card) => (
          <div key={card.label} className="telemetry-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}