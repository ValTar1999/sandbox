import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Loading from "./components/common/base/Loading";

// Page
const BillsPayables = lazy(() => import('./pages/BillsPayables/BillsPayables'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const MultiplePaymentPage = lazy(() => import('./pages/Payment/MultiplePaymentPage'));
const InvoicesReceivables = lazy(() => import('./pages/InvoicesReceivables/InvoicesReceivables'));
const InitiatePaymentRequestPage = lazy(() => import('./pages/InvoicesReceivables/InitiatePaymentRequestPage'));
const Vendors = lazy(() => import('./pages/Vendors/Vendors'));

const Dashboard = () => <div className="p-4">Dashboard Page</div>;
const Customers = () => <div className="p-4">Customers Page</div>;
const Configurator = () => <div className="p-4">Configurator Page</div>;
const SettingsBusinessDetails = () => <div className="p-4">Business Details</div>;
const SettingsUserManagement = () => <div className="p-4">User Management</div>;


function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payables" element={<BillsPayables />} />
          <Route path="/payables/multiple" element={<MultiplePaymentPage />} />
          <Route path="/payables/:id" element={<PaymentPage />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/receivables" element={<InvoicesReceivables />} />
          <Route path="/receivables/:id" element={<InitiatePaymentRequestPage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/settings/business-details" element={<SettingsBusinessDetails />} />
          <Route path="/settings/user-management" element={<SettingsUserManagement />} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
