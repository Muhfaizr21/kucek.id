import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages (pages/public/<fitur>/<isi_fitur>)
import { LandingPage } from './pages/public/landing/LandingPage';
import { TrackingPage } from './pages/public/tracking/TrackingPage';
import { LoginPage } from './pages/public/auth/LoginPage';

// Superadmin Pages (pages/superadmin/<fitur>/<isi_fitur>)
import { AdminDashboardPage } from './pages/superadmin/dashboard/AdminDashboardPage';
import { AdminPosPage } from './pages/superadmin/pos/AdminPosPage';
import { AdminProductionPage } from './pages/superadmin/production/AdminProductionPage';
import { AdminDispatchPage } from './pages/superadmin/dispatch/AdminDispatchPage';
import { AdminPackagesPage } from './pages/superadmin/packages/AdminPackagesPage';
import { AdminFinancePage } from './pages/superadmin/finance/AdminFinancePage';
import { AdminStaffPage } from './pages/superadmin/staff/AdminStaffPage';

// Pelanggan Pages (pages/pelanggan/<fitur>/<isi_fitur>)
import { CustomerHomePage } from './pages/pelanggan/dashboard/CustomerHomePage';
import { CustomerPickupPage } from './pages/pelanggan/pickup/CustomerPickupPage';
import { CustomerPackagesPage } from './pages/pelanggan/subscription/CustomerPackagesPage';
import { CustomerHistoryPage } from './pages/pelanggan/history/CustomerHistoryPage';
import { CustomerVoucherPage } from './pages/pelanggan/voucher/CustomerVoucherPage';
import { CustomerSettingsPage } from './pages/pelanggan/settings/CustomerSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Role: Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/track/:resi" element={<TrackingPage />} />
        <Route path="/login" element={<LoginPage initialMode="login" />} />
        <Route path="/register" element={<LoginPage initialMode="register" />} />

        {/* Role: Superadmin */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/pos" element={<AdminPosPage />} />
        <Route path="/admin/antrean-produksi" element={<AdminProductionPage />} />
        <Route path="/admin/dispatch-jemput" element={<AdminDispatchPage />} />
        <Route path="/admin/paket-langganan" element={<AdminPackagesPage />} />
        <Route path="/admin/laporan-keuangan" element={<AdminFinancePage />} />
        <Route path="/admin/manajemen-staf" element={<AdminStaffPage />} />

        {/* Role: Pelanggan */}
        <Route path="/app" element={<CustomerHomePage />} />
        <Route path="/app/pesan-jemput" element={<CustomerPickupPage />} />
        <Route path="/app/beli-paket" element={<CustomerPackagesPage />} />
        <Route path="/app/riwayat" element={<CustomerHistoryPage />} />
        <Route path="/app/voucher" element={<CustomerVoucherPage />} />
        <Route path="/app/lacak" element={<TrackingPage />} />
        <Route path="/app/lacak/:resi" element={<TrackingPage />} />
        <Route path="/app/pengaturan" element={<CustomerSettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
