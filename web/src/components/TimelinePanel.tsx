const steps = [
  'Order created',
  'Validation completed',
  'Assignment updated',
  'Warehouse checkpoint scanned',
  'Transit event recorded',
];

export function TimelinePanel() {
  return (
    <div className="page-card">
      <div className="widget-card__title">Workflow Timeline</div>
      <div className="checklist">
        {steps.map((step, index) => (
          <div key={step} className={index < 3 ? 'checklist__pass' : 'checklist__fail'}>
            {index < 3 ? '✓' : '•'} {step}
          </div>
        ))}
      </div>
    </div>
  );
}