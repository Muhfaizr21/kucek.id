import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages (pages/public/<fitur>/<isi_fitur>)
import { LandingPage } from './pages/public/landing/LandingPage';
import { LoginPage } from './pages/public/auth/LoginPage';
import { TrackingPage } from './pages/public/tracking/TrackingPage';

// Superadmin Pages (pages/superadmin/<fitur>/<isi_fitur>)
import { AdminDashboardPage } from './pages/superadmin/dashboard/AdminDashboardPage';
import { AdminPosPage } from './pages/superadmin/pos/AdminPosPage';
import { AdminProductionPage } from './pages/superadmin/production/AdminProductionPage';
import { AdminDispatchPage } from './pages/superadmin/dispatch/AdminDispatchPage';
import { AdminCustomersPage } from './pages/superadmin/customers/AdminCustomersPage';
import { AdminServicesPage } from './pages/superadmin/services/AdminServicesPage';
import { AdminPackagesPage } from './pages/superadmin/packages/AdminPackagesPage';
import { AdminFinancePage } from './pages/superadmin/finance/AdminFinancePage';
import { AdminStaffPage } from './pages/superadmin/staff/AdminStaffPage';

// Pelanggan Pages (pages/pelanggan/<fitur>/<isi_fitur>)
import { CustomerHomePage } from './pages/pelanggan/dashboard/CustomerHomePage';
import { CustomerPickupPage } from './pages/pelanggan/pickup/CustomerPickupPage';
import { CustomerPackagesPage } from './pages/pelanggan/subscription/CustomerPackagesPage';
import { CustomerHistoryPage } from './pages/pelanggan/history/CustomerHistoryPage';
import { CustomerSettingsPage } from './pages/pelanggan/settings/CustomerSettingsPage';
import { CustomerVoucherPage } from './pages/pelanggan/voucher/CustomerVoucherPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Role: Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daftar" element={<LoginPage />} />
        <Route path="/lacak" element={<TrackingPage />} />
        <Route path="/lacak/:resi" element={<TrackingPage />} />

        {/* Role: Superadmin */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/pos" element={<AdminPosPage />} />
        <Route path="/admin/antrean-produksi" element={<AdminProductionPage />} />
        <Route path="/admin/dispatch-jemput" element={<AdminDispatchPage />} />
        <Route path="/admin/pelanggan" element={<AdminCustomersPage />} />
        <Route path="/admin/layanan" element={<AdminServicesPage />} />
        <Route path="/admin/paket-langganan" element={<AdminPackagesPage />} />
        <Route path="/admin/laporan-keuangan" element={<AdminFinancePage />} />
        <Route path="/admin/manajemen-staf" element={<AdminStaffPage />} />

        {/* Role: Pelanggan */}
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/dashboard" element={<CustomerHomePage />} />
        <Route path="/app/pesan-jemput" element={<CustomerPickupPage />} />
        <Route path="/app/beli-paket" element={<CustomerPackagesPage />} />
        <Route path="/app/riwayat" element={<CustomerHistoryPage />} />
        <Route path="/app/voucher" element={<CustomerVoucherPage />} />
        <Route path="/app/lacak" element={<TrackingPage />} />
        <Route path="/app/lacak/:resi" element={<TrackingPage />} />
        <Route path="/app/profil-pengaturan" element={<CustomerSettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
