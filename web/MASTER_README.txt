Britium Enterprise Delivery Platform - Final Consolidated Master ZIP

This master package merges the following dedicated patches:
- britium_superadmin_enterpriseadmin_dedicated_bilingual_production_patch.zip
- britium_branch_office_dedicated_bilingual_production_patch.zip
- britium_data_entry_dedicated_bilingual_production_patch.zip
- britium_supervisor_dedicated_bilingual_production_patch.zip
- britium_bi_reporting_dedicated_bilingual_production_patch.zip
- britium_public_tracking_dedicated_bilingual_production_patch.zip
- britium_waybill_scan_workflow_patch.zip
- britium_customer_dedicated_bilingual_production_patch.zip

Included portal coverage:
- Super Admin
- Enterprise Admin
- Branch Office
- Data Entry
- Supervisor
- BI / Reporting
- Customer
- Public Tracking
- End-to-end scan control and waybill engine

This package is intended to be copied into:
  /d/1803APP/britium-enterprise-deployable-system

Recommended application steps:
1. Extract this ZIP
2. Copy all files into your repository root, allowing overwrite
3. Review database migration:
   database/migrations/20260319_waybill_scan_workflow.sql
4. Run:
   npm run build
   npm run dev

Important:
This master ZIP consolidates the dedicated portal routing/menu/page patches and the waybill/scan workflow assets.
It does not automatically rewrite earlier missing portal-specific code that was not part of these patch ZIPs.
