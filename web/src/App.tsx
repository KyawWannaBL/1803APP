import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import RiderDashboard from './screens/RiderDashboard';
import RiderAssignedTasks from './screens/RiderAssignedTasks';
import RiderPickup from './screens/RiderPickup';
import RiderDelivery from './screens/RiderDelivery';
import RiderIncidents from './screens/RiderIncidents';
import RiderWallet from './screens/RiderWallet';
import WarehouseDashboard from './screens/WarehouseDashboard';
import InboundManifest from './screens/InboundManifest';
import ReceivingBay from './screens/ReceivingBay';
import CargoReceivingScan from './screens/CargoReceivingScan';
import ShortageDamageEntry from './screens/ShortageDamageEntry';
import OutboundManifest from './screens/OutboundManifest';
import VehicleLoadVerification from './screens/VehicleLoadVerification';
import LoadConfirmation from './screens/LoadConfirmation';
import DispatchHandover from './screens/DispatchHandover';
import HubToHubTransfer from './screens/HubToHubTransfer';
import OperationsDashboard from './screens/OperationsDashboard';
import ControlRoom from './screens/ControlRoom';
import NewOrders from './screens/NewOrders';
import AssignmentWorkbench from './screens/AssignmentWorkbench';
import RiderAvailability from './screens/RiderAvailability';
import InTransitBoard from './screens/InTransitBoard';
import SLARiskBoard from './screens/SLARiskBoard';
import FailedDeliveries from './screens/FailedDeliveries';
import ReturnsManagement from './screens/ReturnsManagement';
import Escalations from './screens/Escalations';
import RouteOptimization from './screens/RouteOptimization';
import FleetManagement from './screens/FleetManagement';
import FinanceDashboard from './screens/FinanceDashboard';
import CODReconciliation from './screens/CODReconciliation';
import SettlementQueue from './screens/SettlementQueue';
import FinanceInvoices from './screens/FinanceInvoices';
import PaymentRecords from './screens/PaymentRecords';
import RiderPayouts from './screens/RiderPayouts';
import MerchantLedger from './screens/MerchantLedger';
import RefundReview from './screens/RefundReview';
import CashInHand from './screens/CashInHand';
import SupportDashboard from './screens/SupportDashboard';
import TicketInbox from './screens/TicketInbox';
import OrderSearch from './screens/OrderSearch';
import CustomerHistory from './screens/CustomerHistory';
import ComplaintLogging from './screens/ComplaintLogging';
import EscalationQueue from './screens/EscalationQueue';
import KnowledgeBase from './screens/KnowledgeBase';
import MerchantDashboard from './screens/MerchantDashboard';
import MerchantCreateOrder from './screens/MerchantCreateOrder';
import MerchantBulkUpload from './screens/MerchantBulkUpload';
import MerchantOrders from './screens/MerchantOrders';
import MerchantTracking from './screens/MerchantTracking';
import MerchantReturns from './screens/MerchantReturns';
import MerchantInvoices from './screens/MerchantInvoices';
import MerchantSettings from './screens/MerchantSettings';
import MerchantApiKeys from './screens/MerchantApiKeys';
import CustomerDashboard from './screens/CustomerDashboard';
import CustomerCreateReq from './screens/CustomerCreateReq';
import CustomerOrders from './screens/CustomerOrders';
import CustomerTracking from './screens/CustomerTracking';
import CustomerTickets from './screens/CustomerTickets';
import CustomerProfile from './screens/CustomerProfile';
import CustomerPreferences from './screens/CustomerPreferences';
import SysDashboard from './screens/SysDashboard';
import SuperAdminDashboard from './screens/SuperAdminDashboard';
import SuperAdminUsers from './screens/SuperAdminUsers';
import EnterpriseAdminDashboard from './screens/EnterpriseAdminDashboard';
import BranchOfficeDashboard from './screens/BranchOfficeDashboard';
import DataEntryDashboard from './screens/DataEntryDashboard';
import DataEntryVerification from './screens/DataEntryVerification';
import SupervisorDashboard from './screens/SupervisorDashboard';
import BiReportingDashboard from './screens/BiReportingDashboard';
import HrManagement from './screens/HrManagement';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/* Absolute Bypass: Teleport past the login directly to the dashboard */}
      <Route path="/" element={<Navigate to="/enterprise-admin/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/enterprise-admin/dashboard" replace />} />
      
      {/* Master AppShell Wrapper */}
      <Route element={<AppShell />}>
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/rider/assigned-tasks" element={<RiderAssignedTasks />} />
        <Route path="/rider/pickup" element={<RiderPickup />} />
        <Route path="/rider/delivery" element={<RiderDelivery />} />
        <Route path="/rider/incidents" element={<RiderIncidents />} />
        <Route path="/rider/wallet" element={<RiderWallet />} />
        <Route path="/warehouse/dashboard" element={<WarehouseDashboard />} />
        <Route path="/warehouse/inbound-manifest" element={<InboundManifest />} />
        <Route path="/warehouse/receiving-bay" element={<ReceivingBay />} />
        <Route path="/warehouse/cargo-receiving-scan" element={<CargoReceivingScan />} />
        <Route path="/warehouse/shortage-damage-entry" element={<ShortageDamageEntry />} />
        <Route path="/warehouse/outbound-manifest" element={<OutboundManifest />} />
        <Route path="/warehouse/vehicle-load-verification" element={<VehicleLoadVerification />} />
        <Route path="/warehouse/load-confirmation" element={<LoadConfirmation />} />
        <Route path="/warehouse/dispatch-handover" element={<DispatchHandover />} />
        <Route path="/warehouse/hub-transfer" element={<HubToHubTransfer />} />
        <Route path="/operations/dashboard" element={<OperationsDashboard />} />
        <Route path="/operations/control-room" element={<ControlRoom />} />
        <Route path="/operations/new-orders" element={<NewOrders />} />
        <Route path="/operations/assignment-workbench" element={<AssignmentWorkbench />} />
        <Route path="/operations/rider-availability" element={<RiderAvailability />} />
        <Route path="/operations/in-transit-board" element={<InTransitBoard />} />
        <Route path="/operations/sla-risk-board" element={<SLARiskBoard />} />
        <Route path="/operations/failed-deliveries" element={<FailedDeliveries />} />
        <Route path="/operations/returns" element={<ReturnsManagement />} />
        <Route path="/operations/escalations" element={<Escalations />} />
        <Route path="/operations/route-optimization" element={<RouteOptimization />} />
        <Route path="/operations/fleet" element={<FleetManagement />} />
        <Route path="/finance/dashboard" element={<FinanceDashboard />} />
        <Route path="/finance/cod-reconciliation" element={<CODReconciliation />} />
        <Route path="/finance/settlement-queue" element={<SettlementQueue />} />
        <Route path="/finance/invoices" element={<FinanceInvoices />} />
        <Route path="/finance/payment-records" element={<PaymentRecords />} />
        <Route path="/finance/rider-payouts" element={<RiderPayouts />} />
        <Route path="/finance/merchant-ledger" element={<MerchantLedger />} />
        <Route path="/finance/refund-review" element={<RefundReview />} />
        <Route path="/finance/cash-in-hand" element={<CashInHand />} />
        <Route path="/support/dashboard" element={<SupportDashboard />} />
        <Route path="/support/ticket-inbox" element={<TicketInbox />} />
        <Route path="/support/order-search" element={<OrderSearch />} />
        <Route path="/support/customer-history" element={<CustomerHistory />} />
        <Route path="/support/complaint-logging" element={<ComplaintLogging />} />
        <Route path="/support/escalation-queue" element={<EscalationQueue />} />
        <Route path="/support/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
        <Route path="/merchant/create-order" element={<MerchantCreateOrder />} />
        <Route path="/merchant/bulk-upload" element={<MerchantBulkUpload />} />
        <Route path="/merchant/orders" element={<MerchantOrders />} />
        <Route path="/merchant/tracking" element={<MerchantTracking />} />
        <Route path="/merchant/returns" element={<MerchantReturns />} />
        <Route path="/merchant/invoices" element={<MerchantInvoices />} />
        <Route path="/merchant/settings" element={<MerchantSettings />} />
        <Route path="/merchant/api-keys" element={<MerchantApiKeys />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/create-request" element={<CustomerCreateReq />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/tracking" element={<CustomerTracking />} />
        <Route path="/customer/support-tickets" element={<CustomerTickets />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/preferences" element={<CustomerPreferences />} />
        <Route path="/sys/dashboard" element={<SysDashboard />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/users" element={<SuperAdminUsers />} />
        <Route path="/enterprise-admin/dashboard" element={<EnterpriseAdminDashboard />} />
        <Route path="/branch-office/dashboard" element={<BranchOfficeDashboard />} />
        <Route path="/data-entry/dashboard" element={<DataEntryDashboard />} />
        <Route path="/data-entry/verification" element={<DataEntryVerification />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/bi/dashboard" element={<BiReportingDashboard />} />
        <Route path="/hr/dashboard" element={<HrManagement />} />
      </Route>
      
      {/* 404 Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/enterprise-admin/dashboard" replace />} />
    </Routes>
    </BrowserRouter>
  );
}
