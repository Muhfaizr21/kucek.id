export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'superadmin' | 'pelanggan' | 'kasir' | 'operator' | 'kurir';
  sub_role?: string;
  is_active?: boolean;
  customer_id?: number;
  avatar_url?: string;
}

export interface SeederAccount {
  id: 'superadmin' | 'pelanggan';
  badge: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'superadmin' | 'pelanggan';
  redirectPath: '/admin' | '/app';
  description: string;
}

export const SEEDER_ACCOUNTS: SeederAccount[] = [
  {
    id: 'superadmin',
    badge: 'Seeder Superadmin',
    name: 'Superadmin Kucek',
    email: 'admin@kucek.id',
    password: 'admin',
    phone: '081234567890',
    role: 'superadmin',
    redirectPath: '/admin',
    description: 'Akses penuh Dashboard, Kasir POS, Produksi & Keuangan',
  },
  {
    id: 'pelanggan',
    badge: 'Seeder Pelanggan',
    name: 'Budi Santoso',
    email: 'user@kucek.id',
    password: 'user123',
    phone: '081298765432',
    role: 'pelanggan',
    redirectPath: '/app',
    description: 'Portal Pelanggan, Kuota 15.5 Kg & Pesan Antar-Jemput',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const TOKEN_KEY = 'kucek_auth_token';
const USER_KEY = 'kucek_auth_user';

export function getRedirectPathByRole(role?: string): string {
  if (!role) return '/app';
  const normalized = role.toLowerCase();
  if (
    normalized === 'superadmin' ||
    normalized === 'kasir' ||
    normalized === 'operator' ||
    normalized === 'kurir'
  ) {
    return '/admin';
  }
  return '/app';
}

export function saveAuthSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('kucek-user-updated'));
}

export function updateStoredUser(partial: Partial<AuthUser>): AuthUser | null {
  const current = getCurrentUser();
  const base: AuthUser = current || {
    id: 2,
    name: 'Budi Santoso',
    email: 'user@kucek.id',
    phone: '081298765432',
    role: 'pelanggan',
  };
  const updated: AuthUser = { ...base, ...partial };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('kucek-user-updated'));
  return updated;
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function logoutUser(): Promise<void> {
  try {
    const token = getAuthToken();
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    });
  } catch {
    // Abaikan error jaringan saat logout lokal
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export async function loginWithApi(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string; redirectPath: string }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Email atau kata sandi tidak sesuai');
    }

    const user: AuthUser = payload.data.user;
    const token: string = payload.data.token;
    saveAuthSession(token, user);

    return {
      user,
      token,
      redirectPath: getRedirectPathByRole(user.role),
    };
  } catch (err) {
    // Fallback cerdas jika server lokal belum dinyalakan tetapi kredensial cocok dengan seeder
    const matchedSeeder = SEEDER_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === password
    );

    if (matchedSeeder && err instanceof TypeError) {
      const fallbackUser: AuthUser = {
        id: matchedSeeder.id === 'superadmin' ? 1 : 2,
        name: matchedSeeder.name,
        email: matchedSeeder.email,
        phone: matchedSeeder.phone,
        role: matchedSeeder.role,
        sub_role: matchedSeeder.role === 'superadmin' ? 'all' : '',
        is_active: true,
      };
      const fallbackToken = `seeder-local-jwt-${matchedSeeder.id}-${Date.now()}`;
      saveAuthSession(fallbackToken, fallbackUser);

      return {
        user: fallbackUser,
        token: fallbackToken,
        redirectPath: matchedSeeder.redirectPath,
      };
    }

    throw err instanceof Error ? err : new Error('Gagal melakukan autentikasi');
  }
}

export async function registerWithApi(params: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ user: AuthUser; token: string; redirectPath: string }> {
  const fullName = `${params.firstName.trim()} ${params.lastName.trim()}`.trim();
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPhone = params.phone.trim() || '081200000000';

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      name: fullName,
      email: cleanEmail,
      phone: cleanPhone,
      password: params.password,
    }),
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Gagal mendaftarkan akun baru');
  }

  const user: AuthUser = payload.data.user;
  const token: string = payload.data.token;
  saveAuthSession(token, user);

  return {
    user,
    token,
    redirectPath: getRedirectPathByRole(user.role),
  };
}
