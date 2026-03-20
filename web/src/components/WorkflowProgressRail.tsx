type Props = {
  currentStatus?: string | null;
};

const phases = ['onboarding', 'approval', 'dispatch', 'tracking', 'settlement', 'support'];

const statusToPhase: Record<string, string> = {
  created: 'onboarding',
  validated: 'approval',
  assigned: 'dispatch',
  picked_up: 'dispatch',
  in_transit: 'tracking',
  delivered: 'settlement',
  failed: 'support',
  refunded: 'support',
  resolved: 'support',
};

export function WorkflowProgressRail({ currentStatus }: Props) {
  const normalized = String(currentStatus ?? 'created').toLowerCase();
  const currentPhase = statusToPhase[normalized] ?? 'onboarding';
  const activeIndex = phases.indexOf(currentPhase);

  return (
    <section className="widget-card glass-card">
      <div className="widget-card__title widget-card__title--space">
        <strong>Sequential workflow</strong>
        <span className="badge">{normalized}</span>
      </div>
      <div className="progress-rail">
        {phases.map((phase, index) => (
          <div key={phase} className={`progress-rail__step ${index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-active' : ''}`}>
            <span className="progress-rail__dot">{index + 1}</span>
            <div>
              <strong>{phase}</strong>
              <small>
                {phase === 'onboarding' ? 'capture and validate' :
                 phase === 'approval' ? 'supervise release' :
                 phase === 'dispatch' ? 'assign & handoff' :
                 phase === 'tracking' ? 'scan & monitor' :
                 phase === 'settlement' ? 'close financials' :
                 'support and resolve'}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}