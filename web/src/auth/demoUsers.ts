import type { SessionUser } from '@/types';

export const demoUsers: SessionUser[] = [
  { id: 'user-sys', email: 'admin@britiumexpress.app', fullName: 'System Administrator', role: 'SYS' },
  { id: 'user-ea', email: 'ea@britiumexpress.app', fullName: 'Enterprise Admin', role: 'EA' },
  { id: 'user-ops', email: 'ops@britiumexpress.app', fullName: 'Operations Lead', role: 'OPS' },
  { id: 'user-wh', email: 'warehouse@britiumexpress.app', fullName: 'Warehouse Manager', role: 'WHM' },
  { id: 'user-fin', email: 'finance@britiumexpress.app', fullName: 'Finance Manager', role: 'FINANCE_MANAGER' },
  { id: 'user-sup', email: 'support@britiumexpress.app', fullName: 'Support Lead', role: 'SUPPORT' },
  { id: 'user-mer', email: 'merchant@britiumexpress.app', fullName: 'Merchant User', role: 'MERCHANT' },
  { id: 'user-cus', email: 'customer@britiumexpress.app', fullName: 'Customer User', role: 'CUSTOMER' },
  { id: 'rider-01', email: 'rider@britiumexpress.app', fullName: 'Aung Rider', role: 'RIDER' },
];