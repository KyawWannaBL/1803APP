import { useRealtimeFeed } from '@/lib/useRealtimeFeed';

export function ActivityTimelineWidget() {
  const { events, status } = useRealtimeFeed();

  return (
    <section className="widget-card glass-card">
      <div className="widget-card__title widget-card__title--space">
        <strong>Activity timeline</strong>
        <span className={`status-chip ${status === 'live' ? 'status-chip--ok' : status === 'offline' ? 'status-chip--danger' : 'status-chip--warn'}`}>
          {status}
        </span>
      </div>
      <div className="activity-timeline">
        {events.map((event) => (
          <article key={event.id} className={`activity-timeline__item activity-timeline__item--${event.severity}`}>
            <div className="activity-timeline__title">{event.title}</div>
            <div className="activity-timeline__detail">{event.detail}</div>
            <div className="activity-timeline__time">{new Date(event.createdAt).toLocaleTimeString()}</div>
          </article>
        ))}
      </div>
    </section>
  );
}