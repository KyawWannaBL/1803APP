import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const appFile = path.join(srcDir, 'App.tsx');
console.log("🚀 INITIATING TOTAL ROUTER RECONSTRUCTION...");

function findFile(dir, fileName) {
    if (!fs.existsSync(dir)) return null;
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const res = findFile(fullPath, fileName);
            if (res) return res;
        } else if (file.toLowerCase() === fileName.toLowerCase()) return fullPath;
    }
    return null;
}

// Safely locate AppShell regardless of folder structure
const appShellPath = findFile(srcDir, 'appshell.tsx');
let appShellImport = "import AppShell from './components/AppShell';"; // Safe fallback
if (appShellPath) {
    let relPath = path.relative(srcDir, appShellPath).replace(/\\/g, '/');
    relPath = relPath.replace(/\.tsx?$/, '');
    appShellImport = `import AppShell from './${relPath}';`;
}

const screens = [
    { name: "RiderDashboard", route: "/rider/dashboard" },
    { name: "RiderAssignedTasks", route: "/rider/assigned-tasks" },
    { name: "RiderPickup", route: "/rider/pickup" },
    { name: "RiderDelivery", route: "/rider/delivery" },
    { name: "RiderIncidents", route: "/rider/incidents" },
    { name: "RiderWallet", route: "/rider/wallet" },
    { name: "WarehouseDashboard", route: "/warehouse/dashboard" },
    { name: "InboundManifest", route: "/warehouse/inbound-manifest" },
    { name: "ReceivingBay", route: "/warehouse/receiving-bay" },
    { name: "CargoReceivingScan", route: "/warehouse/cargo-receiving-scan" },
    { name: "ShortageDamageEntry", route: "/warehouse/shortage-damage-entry" },
    { name: "OutboundManifest", route: "/warehouse/outbound-manifest" },
    { name: "VehicleLoadVerification", route: "/warehouse/vehicle-load-verification" },
    { name: "LoadConfirmation", route: "/warehouse/load-confirmation" },
    { name: "DispatchHandover", route: "/warehouse/dispatch-handover" },
    { name: "HubToHubTransfer", route: "/warehouse/hub-transfer" },
    { name: "OperationsDashboard", route: "/operations/dashboard" },
    { name: "ControlRoom", route: "/operations/control-room" },
    { name: "NewOrders", route: "/operations/new-orders" },
    { name: "AssignmentWorkbench", route: "/operations/assignment-workbench" },
    { name: "RiderAvailability", route: "/operations/rider-availability" },
    { name: "InTransitBoard", route: "/operations/in-transit-board" },
    { name: "SLARiskBoard", route: "/operations/sla-risk-board" },
    { name: "FailedDeliveries", route: "/operations/failed-deliveries" },
    { name: "ReturnsManagement", route: "/operations/returns" },
    { name: "Escalations", route: "/operations/escalations" },
    { name: "RouteOptimization", route: "/operations/route-optimization" },
    { name: "FleetManagement", route: "/operations/fleet" },
    { name: "FinanceDashboard", route: "/finance/dashboard" },
    { name: "CODReconciliation", route: "/finance/cod-reconciliation" },
    { name: "SettlementQueue", route: "/finance/settlement-queue" },
    { name: "FinanceInvoices", route: "/finance/invoices" },
    { name: "PaymentRecords", route: "/finance/payment-records" },
    { name: "RiderPayouts", route: "/finance/rider-payouts" },
    { name: "MerchantLedger", route: "/finance/merchant-ledger" },
    { name: "RefundReview", route: "/finance/refund-review" },
    { name: "CashInHand", route: "/finance/cash-in-hand" },
    { name: "SupportDashboard", route: "/support/dashboard" },
    { name: "TicketInbox", route: "/support/ticket-inbox" },
    { name: "OrderSearch", route: "/support/order-search" },
    { name: "CustomerHistory", route: "/support/customer-history" },
    { name: "ComplaintLogging", route: "/support/complaint-logging" },
    { name: "EscalationQueue", route: "/support/escalation-queue" },
    { name: "KnowledgeBase", route: "/support/knowledge-base" },
    { name: "MerchantDashboard", route: "/merchant/dashboard" },
    { name: "MerchantCreateOrder", route: "/merchant/create-order" },
    { name: "MerchantBulkUpload", route: "/merchant/bulk-upload" },
    { name: "MerchantOrders", route: "/merchant/orders" },
    { name: "MerchantTracking", route: "/merchant/tracking" },
    { name: "MerchantReturns", route: "/merchant/returns" },
    { name: "MerchantInvoices", route: "/merchant/invoices" },
    { name: "MerchantSettings", route: "/merchant/settings" },
    { name: "MerchantApiKeys", route: "/merchant/api-keys" },
    { name: "CustomerDashboard", route: "/customer/dashboard" },
    { name: "CustomerCreateReq", route: "/customer/create-request" },
    { name: "CustomerOrders", route: "/customer/orders" },
    { name: "CustomerTracking", route: "/customer/tracking" },
    { name: "CustomerTickets", route: "/customer/support-tickets" },
    { name: "CustomerProfile", route: "/customer/profile" },
    { name: "CustomerPreferences", route: "/customer/preferences" },
    { name: "SysDashboard", route: "/sys/dashboard" },
    { name: "SuperAdminDashboard", route: "/super-admin/dashboard" },
    { name: "SuperAdminUsers", route: "/super-admin/users" },
    { name: "EnterpriseAdminDashboard", route: "/enterprise-admin/dashboard" },
    { name: "BranchOfficeDashboard", route: "/branch-office/dashboard" },
    { name: "DataEntryDashboard", route: "/data-entry/dashboard" },
    { name: "DataEntryVerification", route: "/data-entry/verification" },
    { name: "SupervisorDashboard", route: "/supervisor/dashboard" },
    { name: "BiReportingDashboard", route: "/bi/dashboard" },
    { name: "HrManagement", route: "/hr/dashboard" }
];

let importStatements = `import React from 'react';\nimport { Routes, Route, Navigate } from 'react-router-dom';\n${appShellImport}\n`;
let routeElements = screens.map(s => {
    importStatements += `import ${s.name} from './screens/${s.name}';\n`;
    return `        <Route path="${s.route}" element={<${s.name} />} />`;
}).join('\n');

const newAppCode = `${importStatements}

export default function App() {
  return (
    <Routes>
      {/* Absolute Bypass: Teleport past the login directly to the dashboard */}
      <Route path="/" element={<Navigate to="/enterprise-admin/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/enterprise-admin/dashboard" replace />} />
      
      {/* Master AppShell Wrapper */}
      <Route element={<AppShell />}>
${routeElements}
      </Route>
      
      {/* 404 Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/enterprise-admin/dashboard" replace />} />
    </Routes>
  );
}
`;

fs.writeFileSync(appFile, newAppCode);
console.log("✅ App.tsx has been flawlessly reconstructed.");
console.log("--------------------------------------------------------");
console.log("🎉 ROUTER OVERRIDE COMPLETE. Start your server.");
console.log("--------------------------------------------------------");
