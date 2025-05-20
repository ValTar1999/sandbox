import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

// Page
import BillsPayables from './pages/BillsPayables/BillsPayables';
import PaymentPage from './pages/PaymentPage';

const Dashboard = () => <div className="p-4">Dashboard Page</div>;
const Vendors = () => <div className="p-4">Vendors Page</div>;
const InvoicesReceivables = () => <div className="p-4">Invoices/Receivables Page</div>;
const Customers = () => <div className="p-4">Customers Page</div>;
const Configurator = () => <div className="p-4">Configurator Page</div>;
const Settings = () => <div className="p-4">Settings Page</div>;


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/payables" element={<Layout><BillsPayables /></Layout>} />
      <Route path="/payables/:id" element={<Layout><PaymentPage /></Layout>} />
      <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
      <Route path="/receivables" element={<Layout><InvoicesReceivables /></Layout>} />
      <Route path="/customers" element={<Layout><Customers /></Layout>} />
      <Route path="/configurator" element={<Layout><Configurator /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
    </Routes>
  );
}

export default App;
