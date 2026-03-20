import { useMemo } from 'react';
import type { SessionUser } from '@/types';

type Props = {
  userRole?: SessionUser['role'] | string;
};

const templates: Record<string, { inbox: string[]; escalations: string[] }> = {
  SYS: {
    inbox: ['Review platform health alerts', 'Verify role-mismatch audit logs', 'Approve production release window'],
    escalations: ['Realtime feed offline in one region', 'Finance SLA breach in Yangon settlement lane'],
  },
  EA: {
    inbox: ['Confirm branch activation request', 'Review enterprise user access changes', 'Verify data-entry approval queue'],
    escalations: ['New branch sync delayed', 'Role assignment pending approval'],
  },
  OPS: {
    inbox: ['Resolve idle dispatch queue', 'Reassign rider for route RGN-18', 'Validate cross-dock exceptions'],
    escalations: ['Two shipments missing telemetry', 'Hub loading completion risk'],
  },
  FINANCE_MANAGER: {
    inbox: ['Approve settlement batch', 'Review COD discrepancy', 'Release rider payouts'],
    escalations: ['Merchant ledger mismatch', 'Refund review overdue'],
  },
  SUPPORT: {
    inbox: ['Respond to premium merchant ticket', 'Call failed delivery customer', 'Review complaint escalation'],
    escalations: ['Escalation queue exceeded SLA', 'VIP customer unresolved for 2 hours'],
  },
  MERCHANT: {
    inbox: ['Review approval-required orders', 'Upload manifest batch', 'Track delayed shipments'],
    escalations: ['Return requested by customer', 'Invoice dispute opened'],
  },
  CUSTOMER: {
    inbox: ['Track active deliveries', 'Review ticket response', 'Confirm delivery preference update'],
    escalations: ['One order delivery delay alert', 'Support follow-up pending'],
  },
};

export function TaskInboxPanel({ userRole }: Props) {
  const data = useMemo(() => templates[String(userRole ?? '').toUpperCase()] ?? templates.SYS, [userRole]);

  return (
    <section className="widget-card glass-card">
      <div className="widget-card__title">Task inbox & escalation queue</div>
      <div className="task-grid">
        <div>
          <strong>Inbox</strong>
          <ul className="task-list">
            {data.inbox.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <strong>Escalations</strong>
          <ul className="task-list">
            {data.escalations.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}