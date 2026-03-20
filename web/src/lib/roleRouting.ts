import type { AppRole } from '@/types';

export type RoleLanding = {
  role: AppRole | string;
  label: string;
  path: string;
  portalKey: string;
};

export function normalizeRole(role?: string | null): string {
  return String(role ?? '').toUpperCase();
}

export function getRoleLanding(role?: string | null): RoleLanding {
  const normalized = normalizeRole(role);

  if (['SYS', 'SUPER_ADMIN', 'ADMIN'].includes(normalized)) {
    return { role: normalized, label: 'System Control', path: '/sys/dashboard', portalKey: 'super_admin' };
  }
  if (['EA', 'ENTERPRISE_ADMIN'].includes(normalized)) {
    return { role: normalized, label: 'Enterprise Admin', path: '/enterprise-admin/dashboard', portalKey: 'enterprise_admin' };
  }
  if (['MER', 'MERCHANT'].includes(normalized)) {
    return { role: normalized, label: 'Merchant', path: '/merchant/dashboard', portalKey: 'merchant' };
  }
  if (['OPS', 'OPS_MANAGER', 'WH', 'WHM', 'RIDER', 'DATA_ENTRY', 'DE', 'SUPERVISOR', 'SV', 'BRANCH_MANAGER', 'BRANCH_OFFICER'].includes(normalized)) {
    if (['WH', 'WHM'].includes(normalized)) {
      return { role: normalized, label: 'Warehouse', path: '/warehouse/dashboard', portalKey: 'warehouse_hub_operations' };
    }
    if (['RIDER'].includes(normalized)) {
      return { role: normalized, label: 'Execution', path: '/rider/dashboard', portalKey: 'rider' };
    }
    if (['DATA_ENTRY', 'DE'].includes(normalized)) {
      return { role: normalized, label: 'Data Entry', path: '/data-entry/dashboard', portalKey: 'data_entry' };
    }
    if (['SUPERVISOR', 'SV'].includes(normalized)) {
      return { role: normalized, label: 'Supervisor', path: '/supervisor/dashboard', portalKey: 'supervisor' };
    }
    if (['BRANCH_MANAGER', 'BRANCH_OFFICER'].includes(normalized)) {
      return { role: normalized, label: 'Branch Office', path: '/branch-office/dashboard', portalKey: 'branch_office' };
    }
    return { role: normalized, label: 'Operations', path: '/operations/dashboard', portalKey: 'operations_dispatch' };
  }
  if (['FIN', 'FINANCE_MANAGER'].includes(normalized)) {
    return { role: normalized, label: 'Finance', path: '/finance/dashboard', portalKey: 'finance' };
  }
  if (['SUP', 'SUPPORT'].includes(normalized)) {
    return { role: normalized, label: 'Customer Support', path: '/support/dashboard', portalKey: 'customer_support' };
  }
  if (['CUS', 'CUSTOMER'].includes(normalized)) {
    return { role: normalized, label: 'Customer', path: '/customer/dashboard', portalKey: 'customer' };
  }
  if (['BI', 'ANALYST'].includes(normalized)) {
    return { role: normalized, label: 'BI / Reporting', path: '/bi/dashboard', portalKey: 'bi_reporting' };
  }
  return { role: normalized || 'PUBLIC', label: 'Portal Directory', path: '/portal-directory', portalKey: 'portal_directory' };
}

export function inferPortalFromPath(pathname: string) {
  if (pathname.startsWith('/rider')) return 'rider';
  if (pathname.startsWith('/warehouse')) return 'warehouse_hub_operations';
  if (pathname.startsWith('/operations')) return 'operations_dispatch';
  if (pathname.startsWith('/finance')) return 'finance';
  if (pathname.startsWith('/support')) return 'customer_support';
  if (pathname.startsWith('/merchant')) return 'merchant';
  if (pathname.startsWith('/customer')) return 'customer';
  if (pathname.startsWith('/super-admin') || pathname.startsWith('/sys')) return 'super_admin';
  if (pathname.startsWith('/enterprise-admin')) return 'enterprise_admin';
  if (pathname.startsWith('/branch-office')) return 'branch_office';
  if (pathname.startsWith('/data-entry')) return 'data_entry';
  if (pathname.startsWith('/supervisor')) return 'supervisor';
  if (pathname.startsWith('/bi')) return 'bi_reporting';
  return null;
}

export function getPortalBase(key: string, base: string) {
  if (key === 'rider') return '/rider/dashboard';
  if (key === 'warehouse_hub_operations') return '/warehouse/dashboard';
  if (key === 'operations_dispatch') return '/operations/dashboard';
  if (key === 'finance') return '/finance/dashboard';
  if (key === 'customer_support') return '/support/dashboard';
  if (key === 'merchant') return '/merchant/dashboard';
  if (key === 'customer' || key === 'customer_portal') return '/customer/dashboard';
  if (key === 'super_admin') return '/sys/dashboard';
  if (key === 'enterprise_admin') return '/enterprise-admin/dashboard';
  if (key === 'branch_office') return '/branch-office/dashboard';
  if (key === 'data_entry') return '/data-entry/dashboard';
  if (key === 'supervisor') return '/supervisor/dashboard';
  if (key === 'bi_reporting') return '/bi/dashboard';
  return base;
}