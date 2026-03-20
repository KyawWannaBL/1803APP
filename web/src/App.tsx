import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import screens from '@/data/screenCatalog.json';
import portals from '@/data/portalConfig.json';
import aliases from '@/data/routeAliases.json';
import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AppShell } from '@/components/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoginPage } from '@/screens/LoginPage';
import { PortalLandingPage } from '@/screens/PortalLandingPage';
import { ScreenPage } from '@/screens/ScreenPage';
import { ResetPasswordPage } from '@/screens/ResetPasswordPage'; 

import { RiderDashboardPage } from '@/screens/rider/RiderDashboardPage';
import { RiderAssignedTasksPage } from '@/screens/rider/RiderAssignedTasksPage';
import { RiderPickupPage } from '@/screens/rider/RiderPickupPage';
import { RiderDeliveryPage } from '@/screens/rider/RiderDeliveryPage';
import { RiderIncidentPage } from '@/screens/rider/RiderIncidentPage';

import { WarehouseDashboardPage } from '@/screens/warehouse/WarehouseDashboardPage';
import { WarehouseInboundManifestPage } from '@/screens/warehouse/WarehouseInboundManifestPage';
import { WarehouseReceivingBayPage } from '@/screens/warehouse/WarehouseReceivingBayPage';
import { WarehouseCargoReceivingScanPage } from '@/screens/warehouse/WarehouseCargoReceivingScanPage';
import { WarehouseShortageDamageEntryPage } from '@/screens/warehouse/WarehouseShortageDamageEntryPage';
import { WarehouseOutboundManifestPage } from '@/screens/warehouse/WarehouseOutboundManifestPage';
import { WarehouseVehicleLoadVerificationPage } from '@/screens/warehouse/WarehouseVehicleLoadVerificationPage';
import { WarehouseLoadConfirmationPage } from '@/screens/warehouse/WarehouseLoadConfirmationPage';
import { WarehouseDispatchHandoverPage } from '@/screens/warehouse/WarehouseDispatchHandoverPage';

import { OperationsDashboardPage } from '@/screens/operations/OperationsDashboardPage';
import { OperationsControlRoomPage } from '@/screens/operations/OperationsControlRoomPage';
import { OperationsNewOrdersPage } from '@/screens/operations/OperationsNewOrdersPage';
import { OperationsAssignmentWorkbenchPage } from '@/screens/operations/OperationsAssignmentWorkbenchPage';
import { OperationsRiderAvailabilityPage } from '@/screens/operations/OperationsRiderAvailabilityPage';
import { OperationsInTransitBoardPage } from '@/screens/operations/OperationsInTransitBoardPage';
import { OperationsSlaRiskBoardPage } from '@/screens/operations/OperationsSlaRiskBoardPage';
import { OperationsFailedDeliveriesPage } from '@/screens/operations/OperationsFailedDeliveriesPage';
import { OperationsReturnsPage } from '@/screens/operations/OperationsReturnsPage';
import { OperationsEscalationsPage } from '@/screens/operations/OperationsEscalationsPage';

import { FinanceDashboardPage } from '@/screens/finance/FinanceDashboardPage';
import { FinanceCodReconciliationPage } from '@/screens/finance/FinanceCodReconciliationPage';
import { FinanceSettlementQueuePage } from '@/screens/finance/FinanceSettlementQueuePage';
import { FinanceInvoicesPage } from '@/screens/finance/FinanceInvoicesPage';
import { FinancePaymentRecordsPage } from '@/screens/finance/FinancePaymentRecordsPage';
import { FinanceRiderPayoutsPage } from '@/screens/finance/FinanceRiderPayoutsPage';
import { FinanceMerchantLedgerPage } from '@/screens/finance/FinanceMerchantLedgerPage';
import { FinanceRefundReviewPage } from '@/screens/finance/FinanceRefundReviewPage';

import { SupportDashboardPage } from '@/screens/support/SupportDashboardPage';
import { SupportTicketInboxPage } from '@/screens/support/SupportTicketInboxPage';
import { SupportOrderSearchPage } from '@/screens/support/SupportOrderSearchPage';
import { SupportCustomerHistoryPage } from '@/screens/support/SupportCustomerHistoryPage';
import { SupportComplaintLoggingPage } from '@/screens/support/SupportComplaintLoggingPage';
import { SupportEscalationQueuePage } from '@/screens/support/SupportEscalationQueuePage';
import { SupportKnowledgeBasePage } from '@/screens/support/SupportKnowledgeBasePage';

import { MerchantDashboardPage } from '@/screens/merchant/MerchantDashboardPage';
import { MerchantCreateOrderPage } from '@/screens/merchant/MerchantCreateOrderPage';
import { MerchantBulkUploadPage } from '@/screens/merchant/MerchantBulkUploadPage';
import { MerchantOrdersPage } from '@/screens/merchant/MerchantOrdersPage';
import { MerchantTrackingPage } from '@/screens/merchant/MerchantTrackingPage';
import { MerchantReturnsPage } from '@/screens/merchant/MerchantReturnsPage';
import { MerchantInvoicesPage } from '@/screens/merchant/MerchantInvoicesPage';
import { MerchantSettingsPage } from '@/screens/merchant/MerchantSettingsPage';

import { CustomerDashboardPage } from '@/screens/customer/CustomerDashboardPage';
import { CustomerCreateRequestPage } from '@/screens/customer/CustomerCreateRequestPage';
import { CustomerOrdersPage } from '@/screens/customer/CustomerOrdersPage';
import { CustomerTrackingPage } from '@/screens/customer/CustomerTrackingPage';
import { CustomerSupportTicketsPage } from '@/screens/customer/CustomerSupportTicketsPage';
import { CustomerProfilePage } from '@/screens/customer/CustomerProfilePage';
import { CustomerPreferencesPage } from '@/screens/customer/CustomerPreferencesPage';

const LIVE_PORTAL_KEYS = new Set([
  'rider',
  'warehouse_hub_operations',
  'operations_dispatch',
  'finance',
  'customer_support',
  'merchant',
  'customer',
  'customer_portal',
]);

const publicScreens = screens.filter((s) => s.portal === 'public_tracking');

const dedicatedRoutes = new Set([
  '/rider/dashboard',
  '/rider/assigned-tasks',
  '/rider/pickup',
  '/rider/delivery',
  '/rider/incidents',
  '/warehouse/dashboard',
  '/warehouse/inbound-manifest',
  '/warehouse/receiving-bay',
  '/warehouse/cargo-receiving-scan',
  '/warehouse/shortage-damage-entry',
  '/warehouse/outbound-manifest',
  '/warehouse/vehicle-load-verification',
  '/warehouse/load-confirmation',
  '/warehouse/dispatch-handover',
  '/operations/dashboard',
  '/operations/control-room',
  '/operations/new-orders',
  '/operations/assignment-workbench',
  '/operations/rider-availability',
  '/operations/in-transit-board',
  '/operations/sla-risk-board',
  '/operations/failed-deliveries',
  '/operations/returns',
  '/operations/escalations',
  '/operations/shipments',
  '/operations/shipment-lifecycle',
  '/finance/dashboard',
  '/finance/cod-reconciliation',
  '/finance/settlement-queue',
  '/finance/invoices',
  '/finance/payment-records',
  '/finance/rider-payouts',
  '/finance/merchant-ledger',
  '/finance/refund-review',
  '/support/dashboard',
  '/support/ticket-inbox',
  '/support/order-search',
  '/support/customer-history',
  '/support/complaint-logging',
  '/support/escalation-queue',
  '/support/knowledge-base',
  '/merchant/dashboard',
  '/merchant/create-order',
  '/merchant/bulk-upload',
  '/merchant/orders',
  '/merchant/tracking',
  '/merchant/returns',
  '/merchant/invoices',
  '/merchant/settings',
  '/customer/dashboard',
  '/customer/create-request',
  '/customer/orders',
  '/customer/tracking',
  '/customer/support-tickets',
  '/customer/profile',
  '/customer/preferences',
]);

const privateScreens = screens.filter(
  (s) => s.portal !== 'public_tracking' && !dedicatedRoutes.has(s.route),
);

function getPortalHome(key: string, base: string) {
  if (key === 'rider') return '/rider/dashboard';
  if (key === 'warehouse_hub_operations') return '/warehouse/dashboard';
  if (key === 'operations_dispatch') return '/operations/dashboard';
  if (key === 'finance') return '/finance/dashboard';
  if (key === 'customer_support') return '/support/dashboard';
  if (key === 'merchant') return '/merchant/dashboard';
  if (key === 'customer' || key === 'customer_portal') return '/customer/dashboard';
  return base;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/portal-home' : '/login'} replace />} />
      <Route path="/login" element={<LoginPage />} />

      {publicScreens.map((s) => (
        <Route key={s.code} path={s.route} element={<ScreenPage />} />
      ))}

      <Route element={<ProtectedRoute />}>
        <Route path="/portal-home" element={<PortalLandingPage />} />

        <Route element={<AppShell />}>
          {Object.entries(portals)
            .filter(([key, p]) => p.base !== '/track' && LIVE_PORTAL_KEYS.has(key))
            .map(([key, portal]) => (
              <Route
                key={portal.base}
                path={portal.base}
                element={<Navigate to={getPortalHome(key, portal.base)} replace />}
              />
            ))}

          <Route path="/rider/dashboard" element={<RiderDashboardPage />} />
          <Route path="/rider/assigned-tasks" element={<RiderAssignedTasksPage />} />
          <Route path="/rider/pickup" element={<RiderPickupPage />} />
          <Route path="/rider/delivery" element={<RiderDeliveryPage />} />
          <Route path="/rider/incidents" element={<RiderIncidentPage />} />

          <Route path="/warehouse/dashboard" element={<WarehouseDashboardPage />} />
          <Route path="/warehouse/inbound-manifest" element={<WarehouseInboundManifestPage />} />
          <Route path="/warehouse/receiving-bay" element={<WarehouseReceivingBayPage />} />
          <Route path="/warehouse/cargo-receiving-scan" element={<WarehouseCargoReceivingScanPage />} />
          <Route path="/warehouse/shortage-damage-entry" element={<WarehouseShortageDamageEntryPage />} />
          <Route path="/warehouse/outbound-manifest" element={<WarehouseOutboundManifestPage />} />
          <Route path="/warehouse/vehicle-load-verification" element={<WarehouseVehicleLoadVerificationPage />} />
          <Route path="/warehouse/load-confirmation" element={<WarehouseLoadConfirmationPage />} />
          <Route path="/warehouse/dispatch-handover" element={<WarehouseDispatchHandoverPage />} />

          <Route path="/operations/dashboard" element={<OperationsDashboardPage />} />
          <Route path="/operations/control-room" element={<OperationsControlRoomPage />} />
          <Route path="/operations/new-orders" element={<OperationsNewOrdersPage />} />
          <Route path="/operations/assignment-workbench" element={<OperationsAssignmentWorkbenchPage />} />
          <Route path="/operations/rider-availability" element={<OperationsRiderAvailabilityPage />} />
          <Route path="/operations/in-transit-board" element={<OperationsInTransitBoardPage />} />
          <Route path="/operations/sla-risk-board" element={<OperationsSlaRiskBoardPage />} />
          <Route path="/operations/failed-deliveries" element={<OperationsFailedDeliveriesPage />} />
          <Route path="/operations/returns" element={<OperationsReturnsPage />} />
          <Route path="/operations/escalations" element={<OperationsEscalationsPage />} />
          <Route path="/operations/shipments" element={<Navigate to="/operations/new-orders" replace />} />
          <Route path="/operations/shipment-lifecycle" element={<Navigate to="/operations/in-transit-board" replace />} />

          <Route path="/finance/dashboard" element={<FinanceDashboardPage />} />
          <Route path="/finance/cod-reconciliation" element={<FinanceCodReconciliationPage />} />
          <Route path="/finance/settlement-queue" element={<FinanceSettlementQueuePage />} />
          <Route path="/finance/invoices" element={<FinanceInvoicesPage />} />
          <Route path="/finance/payment-records" element={<FinancePaymentRecordsPage />} />
          <Route path="/finance/rider-payouts" element={<FinanceRiderPayoutsPage />} />
          <Route path="/finance/merchant-ledger" element={<FinanceMerchantLedgerPage />} />
          <Route path="/finance/refund-review" element={<FinanceRefundReviewPage />} />

          <Route path="/support/dashboard" element={<SupportDashboardPage />} />
          <Route path="/support/ticket-inbox" element={<SupportTicketInboxPage />} />
          <Route path="/support/order-search" element={<SupportOrderSearchPage />} />
          <Route path="/support/customer-history" element={<SupportCustomerHistoryPage />} />
          <Route path="/support/complaint-logging" element={<SupportComplaintLoggingPage />} />
          <Route path="/support/escalation-queue" element={<SupportEscalationQueuePage />} />
          <Route path="/support/knowledge-base" element={<SupportKnowledgeBasePage />} />

          <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
          <Route path="/merchant/create-order" element={<MerchantCreateOrderPage />} />
          <Route path="/merchant/bulk-upload" element={<MerchantBulkUploadPage />} />
          <Route path="/merchant/orders" element={<MerchantOrdersPage />} />
          <Route path="/merchant/tracking" element={<MerchantTrackingPage />} />
          <Route path="/merchant/returns" element={<MerchantReturnsPage />} />
          <Route path="/merchant/invoices" element={<MerchantInvoicesPage />} />
          <Route path="/merchant/settings" element={<MerchantSettingsPage />} />

          <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/customer/create-request" element={<CustomerCreateRequestPage />} />
          <Route path="/customer/orders" element={<CustomerOrdersPage />} />
          <Route path="/customer/tracking" element={<CustomerTrackingPage />} />
          <Route path="/customer/support-tickets" element={<CustomerSupportTicketsPage />} />
          <Route path="/customer/profile" element={<CustomerProfilePage />} />
          <Route path="/customer/preferences" element={<CustomerPreferencesPage />} />

          {privateScreens.map((s) => (
            <Route key={s.code} path={s.route} element={<ScreenPage />} />
          ))}

          {aliases.map((a) => (
            <Route
              key={a.legacyRoute}
              path={a.legacyRoute}
              element={<Navigate to={a.newRoute} replace />}
            />
          ))}
        </Route>
      </Route>

      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to={user ? '/portal-home' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}