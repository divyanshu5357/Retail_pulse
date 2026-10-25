import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import OverviewPage from './pages/OverviewPage';
import SalesAnalysisPage from './pages/SalesAnalysisPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import ExcelPracticalPage from './pages/ExcelPracticalPage';
import ExcelPivotTablePage from './pages/ExcelPivotTablePage';
import SqlAnalysisPage from './pages/SqlAnalysisPage';
import TableauExportPage from './pages/TableauExportPage';
import SettingsPage from './pages/SettingsPage';
import { fetchHealth } from './services/api';

const PAGE_TITLES = {
  overview: 'Executive Performance Overview',
  sales: 'In-Depth Sales & Margin Analysis',
  customers: 'Customer Spending & Retention Analytics',
  products: 'Merchandise Performance & Product Catalog',
  orders: 'Order Transactions & Fulfillment Log',
  excel: 'Excel Logical Formulas Laboratory',
  pivot: 'Excel Pivot Table Guide & Architecture',
  sql: 'SQL Relational Queries & Database Playground',
  tableau: 'Tableau Visual Analytics & Export Hub',
  settings: 'System Configuration & Database Telemetry'
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => setDbStatus(data.database))
      .catch((err) => console.error('Initial DB health check error:', err));
  }, []);

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage setActivePage={setActivePage} />;
      case 'sales':
        return <SalesAnalysisPage />;
      case 'customers':
        return <CustomersPage />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'excel':
        return <ExcelPracticalPage />;
      case 'pivot':
        return <ExcelPivotTablePage />;
      case 'sql':
        return <SqlAnalysisPage />;
      case 'tableau':
        return <TableauExportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activePage={activePage}
          pageTitle={PAGE_TITLES[activePage] || 'Retail Analytics'}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}
