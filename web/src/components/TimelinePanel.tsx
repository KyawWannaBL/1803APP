type Props = {
  currentStatus?: string | null;
};

const steps = [
  { key: 'created', label: 'Onboarding captured' },
  { key: 'validated', label: 'Approval completed' },
  { key: 'assigned', label: 'Dispatch orchestrated' },
  { key: 'in_transit', label: 'Tracking live' },
  { key: 'delivered', label: 'Settlement ready' },
  { key: 'failed', label: 'Support initiated' },
];

export function TimelinePanel({ currentStatus = 'assigned' }: Props) {
  const activeIndex = steps.findIndex((step) => step.key === currentStatus);

  return (
    <div className="page-card glass-card">
      <div className="widget-card__title">Workflow Timeline</div>
      <div className="checklist">
        {steps.map((step, index) => {
          const state = activeIndex === -1 ? index < 3 : index <= activeIndex;
          return (
            <div key={step.key} className={state ? 'checklist__pass' : 'checklist__fail'}>
              {state ? '✓' : '•'} {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimelinePanel;