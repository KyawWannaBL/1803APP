export type AppRole =
  | 'SYS'
  | 'SUPER_ADMIN'
  | 'EA'
  | 'BRANCH_MANAGER'
  | 'BRANCH_OFFICER'
  | 'DATA_ENTRY'
  | 'DE'
  | 'SUPERVISOR'
  | 'SV'
  | 'BI'
  | 'ANALYST'
  | 'FIN'
  | 'FINANCE_MANAGER'
  | 'OPS'
  | 'OPS_MANAGER'
  | 'WHM'
  | 'WH'
  | 'RIDER'
  | 'SUP'
  | 'SUPPORT'
  | 'MER'
  | 'MERCHANT'
  | 'CUS'
  | 'CUSTOMER'
  | 'PUBLIC';

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
};

export type ScreenCatalogEntry = {
  code: string;
  route: string;
  legacy_route?: string | null;
  title_en: string;
  title_mm: string;
  portal: string;
  portal_name_en: string;
  portal_name_mm: string;
  roles: AppRole[] | string[];
  menu: string;
  kind: string;
  tables: string[];
  modules?: string[];
};