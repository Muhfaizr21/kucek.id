import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { TrackingPage } from './pages/public/TrackingPage';
import { LoginPage } from './pages/public/LoginPage';

// Superadmin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPosPage } from './pages/admin/AdminPosPage';
import { AdminProductionPage } from './pages/admin/AdminProductionPage';
import { AdminDispatchPage } from './pages/admin/AdminDispatchPage';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminFinancePage } from './pages/admin/AdminFinancePage';
import { AdminStaffPage } from './pages/admin/AdminStaffPage';

// Customer Pages
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { CustomerPickupPage } from './pages/customer/CustomerPickupPage';
import { CustomerPackagesPage } from './pages/customer/CustomerPackagesPage';
import { CustomerHistoryPage } from './pages/customer/CustomerHistoryPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/track/:resi" element={<TrackingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Superadmin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/pos" element={<AdminPosPage />} />
        <Route path="/admin/antrean-produksi" element={<AdminProductionPage />} />
        <Route path="/admin/dispatch-jemput" element={<AdminDispatchPage />} />
        <Route path="/admin/paket-langganan" element={<AdminPackagesPage />} />
        <Route path="/admin/laporan-keuangan" element={<AdminFinancePage />} />
        <Route path="/admin/manajemen-staf" element={<AdminStaffPage />} />

        {/* Customer Portal Routes */}
        <Route path="/app" element={<CustomerHomePage />} />
        <Route path="/app/pesan-jemput" element={<CustomerPickupPage />} />
        <Route path="/app/beli-paket" element={<CustomerPackagesPage />} />
        <Route path="/app/riwayat" element={<CustomerHistoryPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
