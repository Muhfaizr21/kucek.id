import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';

// Public Pages (pages/public/<fitur>/<isi_fitur>)
import { LandingPage } from './pages/public/landing/LandingPage';
import { LoginPage } from './pages/public/auth/LoginPage';
import { TrackingPage } from './pages/public/tracking/TrackingPage';
import { AboutPage } from './pages/public/about/AboutPage';
import { ServicesPage } from './pages/public/services/ServicesPage';

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

const ADMIN_ROLES: Array<'superadmin' | 'kasir' | 'operator' | 'kurir'> = [
  'superadmin',
  'kasir',
  'operator',
  'kurir',
];

function App() {
  return (
    <Router>
      <Routes>
        {/* Role: Public (Akses Umum) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/layanan" element={<ServicesPage />} />
        <Route path="/service" element={<Navigate to="/layanan" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/daftar"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route path="/lacak" element={<Navigate to="/login" replace />} />
        <Route path="/lacak/:resi" element={<Navigate to="/login" replace />} />

        {/* Role: Superadmin & Tim Operasional Outlet (Dilindungi ProtectedRoute) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pos"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminPosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/antrean-produksi"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminProductionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dispatch-jemput"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminDispatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pelanggan"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminCustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/layanan"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/paket-langganan"
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminPackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan-keuangan"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminFinancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manajemen-staf"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminStaffPage />
            </ProtectedRoute>
          }
        />

        {/* Role: Pelanggan (Dilindungi ProtectedRoute) */}
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <CustomerHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/pesan-jemput"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <CustomerPickupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/beli-paket"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <CustomerPackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/riwayat"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <CustomerHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/voucher"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <CustomerVoucherPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/lacak"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <TrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/lacak/:resi"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <TrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/profil-pengaturan"
          element={
            <ProtectedRoute allowedRoles={['pelanggan', 'superadmin']}>
              <CustomerSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
