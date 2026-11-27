import React, { useState, useRef } from 'react';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import {
  Camera,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Bell,
  Plus,
  Trash2,
  Loader2,
  Upload,
} from 'lucide-react';
import {
  getCurrentUser,
  getAuthToken,
  updateStoredUser,
} from '../../../services/authService';

type SettingsTab = 'profil' | 'alamat' | 'preferensi' | 'keamanan';

interface SavedAddress {
  id: string;
  label: string;
  area: string;
  fullAddress: string;
  landmark: string;
  isPrimary: boolean;
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80',
];

export const CustomerSettingsPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<SettingsTab>('profil');

  // 1. State Profil & Gambar PP
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentUser?.avatar_url ||
      localStorage.getItem('kucek_customer_avatar') ||
      DEFAULT_AVATAR
  );
  const [name, setName] = useState<string>(currentUser?.name || 'Budi Santoso');
  const [email, setEmail] = useState<string>(currentUser?.email || 'user@kucek.id');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '081298765432');
  const [bioNote, setBioNote] = useState<string>(
    'Pelanggan rutin Paket Keluarga Ceria • Jemput setiap Sabtu pagi'
  );

  // 2. State Buku Alamat & Patokan Kurir
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      label: 'Rumah Utama',
      area: 'Sleman (Zona Gratis Ongkir)',
      fullAddress: 'Jl. Kaliurang KM 5 No. 12, Karangwuni, Depok, Sleman, Yogyakarta',
      landmark: 'Pagar hitam samping minimarket, bel sebelah kiri',
      isPrimary: true,
    },
    {
      id: 'addr-2',
      label: 'Kantor / Studio',
      area: 'Kota Yogyakarta (Zona Gratis Ongkir)',
      fullAddress: 'Jl. Cik Di Tiro No. 28, Terban, Gondokusuman, Yogyakarta',
      landmark: 'Titip di resepsionis lantai 1 atas nama Budi',
      isPrimary: false,
    },
  ]);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrArea, setNewAddrArea] = useState('Sleman (Zona Gratis Ongkir)');
  const [newAddrFull, setNewAddrFull] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');

  // 3. State Preferensi Cucian & Treatment
  const [defaultScent, setDefaultScent] = useState('ocean_fresh');
  const [packagingType, setPackagingType] = useState('lipat_rapi');
  const [separateWhiteClothes, setSeparateWhiteClothes] = useState(true);
  const [hypoallergenicDetergent, setHypoallergenicDetergent] = useState(false);
  const [gentleSteamIron, setGentleSteamIron] = useState(true);
  const [useEcoBag, setUseEcoBag] = useState(true);

  // 4. State Keamanan (Ganti Password) & Notifikasi
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [notifWhatsappCourier, setNotifWhatsappCourier] = useState(true);
  const [notifProductionStage, setNotifProductionStage] = useState(true);
  const [notifLowQuota, setNotifLowQuota] = useState(true);

  // Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [toastSuccess, setToastSuccess] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setToastSuccess(msg);
      setToastError(null);
    } else {
      setToastError(msg);
      setToastSuccess(null);
    }
    setTimeout(() => {
      setToastSuccess(null);
      setToastError(null);
    }, 4000);
  };

  // Handler Upload File Foto Profil (PP)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', 'Format file harus berupa gambar (JPG, PNG, atau WEBP)');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showFeedback('error', 'Ukuran foto maksimal 4 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem('kucek_customer_avatar', dataUrl);
      updateStoredUser({ avatar_url: dataUrl });
      showFeedback('success', 'Foto profil baru berhasil diunggah dan dipasang!');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (presetUrl: string) => {
    setAvatarUrl(presetUrl);
    localStorage.setItem('kucek_customer_avatar', presetUrl);
    updateStoredUser({ avatar_url: presetUrl });
    showFeedback('success', 'Avatar profil berhasil diperbarui!');
  };

  // Handler Simpan Biodata Profil ke Backend
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const primaryAddress =
        addresses.find((a) => a.isPrimary)?.fullAddress ||
        'Jl. Kaliurang KM 5 No. 12, Sleman';
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

      if (token) {
        await fetch(`${apiBase}/customer/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            address: primaryAddress,
            area: 'Sleman',
          }),
        });
      }

      updateStoredUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl,
      });

      showFeedback('success', 'Profil & foto pelanggan berhasil disimpan!');
    } catch {
      updateStoredUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl,
      });
      showFeedback('success', 'Perubahan profil berhasil disimpan!');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler Tambah Alamat Baru
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel.trim() || !newAddrFull.trim()) {
      showFeedback('error', 'Label tempat dan alamat lengkap wajib diisi');
      return;
    }

    const created: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel.trim(),
      area: newAddrArea,
      fullAddress: newAddrFull.trim(),
      landmark: newAddrLandmark.trim() || 'Sesuai titik alamat',
      isPrimary: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, created]);
    setNewAddrLabel('');
    setNewAddrFull('');
    setNewAddrLandmark('');
    showFeedback('success', `Alamat "${created.label}" berhasil ditambahkan!`);
  };

  const handleSetPrimaryAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }))
    );
    showFeedback('success', 'Alamat penjemputan utama berhasil diubah!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showFeedback('success', 'Alamat berhasil dihapus dari daftar');
  };

  // Handler Simpan Preferensi Laundry
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'kucek_laundry_prefs',
      JSON.stringify({
        defaultScent,
        packagingType,
        separateWhiteClothes,
        hypoallergenicDetergent,
        gentleSteamIron,
        useEcoBag,
      })
    );
    showFeedback(
      'success',
      'Standar perawatan pakaian & aroma default berhasil disimpan!'
    );
  };

  // Handler Ganti Kata Sandi ke Backend
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showFeedback('error', 'Masukkan kata sandi Anda saat ini');
      return;
    }
    if (newPassword.length < 4) {
      showFeedback('error', 'Kata sandi baru minimal 4 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback('error', 'Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    setIsSaving(true);
    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

      const response = await fetch(`${apiBase}/customer/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Kata sandi saat ini tidak sesuai');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showFeedback('success', 'Kata sandi akun Anda berhasil diperbarui!');
    } catch (err) {
      showFeedback(
        'error',
        err instanceof Error ? err.message : 'Gagal mengganti kata sandi'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Hitung indikator kekuatan password
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'Belum diisi', color: 'bg-slate-200', width: 'w-0' };
    if (pwd.length < 5)
      return { label: 'Lemah', color: 'bg-rose-500', width: 'w-1/3' };
    if (pwd.length < 8)
      return { label: 'Sedang', color: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Kuat & Aman', color: 'bg-[#10B981]', width: 'w-full' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  return (
    <CustomerLayout>
      <div className="max-w-[1140px] mx-auto space-y-6">
        {/* Top Page Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
              Profil & Pengaturan Akun
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              Kelola foto profil, alamat jemput kurir, standar perawatan pakaian, dan keamanan kata sandi dalam satu tempat
            </p>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastSuccess && (
          <div className="p-4 rounded-2xl bg-[#E6F8F3] border border-[#10B981]/30 text-[#065F46] text-xs font-bold flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{toastSuccess}</span>
          </div>
        )}
        {toastError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{toastError}</span>
          </div>
        )}

        {/* TOP HERO CARD: Profile Overview & Direct Avatar Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Interactive Avatar with Camera Overlay */}
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#0095FF]/30 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Unggah Foto Profil Baru"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white flex items-center justify-center shadow-lg transition cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-[#111827]">{name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6F8F3] text-[#10B981] text-[10.5px] font-extrabold">
                  Member Paket Keluarga • Aktif
                </span>
              </div>
              <p className="text-xs font-medium text-[#64748B] mt-1">
                {email} • WhatsApp: <b className="text-[#111827]">{phone}</b>
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-1">{bioNote}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_6px_16px_-4px_rgba(0,149,255,0.4)] transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Foto PP</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS (4 Modul Terpadu) */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {[
            { id: 'profil' as const, label: 'Biodata & Foto PP', icon: User },
            { id: 'alamat' as const, label: 'Alamat & Patokan Kurir', icon: MapPin },
            {
              id: 'preferensi' as const,
              label: 'Preferensi Cucian & Parfum',
              icon: Sparkles,
            },
            {
              id: 'keamanan' as const,
              label: 'Ganti Password & Notifikasi',
              icon: Lock,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#0095FF] text-white shadow-[0_6px_16px_-4px_rgba(0,149,255,0.4)]'
                    : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BIODATA & FOTO PROFIL (PP) */}
        {activeTab === 'profil' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Galeri & Upload Foto Profil */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">
                  Foto Profil (PP) Pelanggan
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Memudahkan kurir mengenali Anda saat penjemputan & pengantaran
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#0095FF]/40 hover:border-[#0095FF] bg-[#F4F8FD]/60 rounded-2xl p-6 text-center cursor-pointer transition space-y-3"
              >
                <img
                  src={avatarUrl}
                  alt="Preview PP"
                  className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-md border-2 border-white"
                />
                <div>
                  <p className="text-xs font-extrabold text-[#0095FF]">
                    Klik untuk pilih foto dari perangkat Anda
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Mendukung JPG, PNG, WEBP (Maks. 4 MB)
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
                  Atau Pilih Avatar Cepat:
                </p>
                <div className="flex items-center gap-3">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        avatarUrl === preset
                          ? 'border-[#0095FF] scale-105 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset}
                        alt={`Avatar ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Form Biodata */}
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-5"
            >
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">
                  Informasi Identitas & Kontak
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Nomor WhatsApp digunakan untuk pengiriman e-nota dan pelacakan resi otomatis
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                  Alamat Email Akun
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                  Catatan Jadwal Langganan / Bio Singkat
                </label>
                <textarea
                  rows={2}
                  value={bioNote}
                  onChange={(e) => setBioNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-semibold text-[#111827] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)] transition flex items-center gap-2 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: BUKU ALAMAT & PATOKAN KURIR */}
        {activeTab === 'alamat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white p-5 rounded-2xl border transition ${
                    addr.isPrimary
                      ? 'border-[#0095FF] shadow-[0_8px_22px_-8px_rgba(0,149,255,0.25)]'
                      : 'border-slate-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#111827]">
                          {addr.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#0095FF]">
                          {addr.area}
                        </span>
                        {addr.isPrimary && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#E6F8F3] text-[#10B981]">
                            Alamat Utama
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#334155] mt-2">
                        {addr.fullAddress}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        Patokan Kurir: <b className="text-slate-600">{addr.landmark}</b>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!addr.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryAddress(addr.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#0095FF] hover:text-white text-[11px] font-bold text-slate-600 transition cursor-pointer"
                        >
                          Jadikan Utama
                        </button>
                      )}
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Alamat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddAddress}
              className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4 h-fit"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0095FF]" />
                <h3 className="text-base font-extrabold text-[#111827]">
                  Tambah Titik Penjemputan Baru
                </h3>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1">
                  Label Lokasi
                </label>
                <input
                  type="text"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  placeholder="Contoh: Kos Putri / Apartemen / Kantor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1">
                  Zona & Area Kurir
                </label>
                <select
                  value={newAddrArea}
                  onChange={(e) => setNewAddrArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                >
                  <option value="Sleman (Zona Gratis Ongkir)">
                    Sleman (Zona Gratis Ongkir)
                  </option>
                  <option value="Kota Yogyakarta (Zona Gratis Ongkir)">
                    Kota Yogyakarta (Zona Gratis Ongkir)
                  </option>
                  <option value="Bantul Utara (Gratis Min. 5 Kg)">
                    Bantul Utara (Gratis Min. 5 Kg)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  rows={2}
                  value={newAddrFull}
                  onChange={(e) => setNewAddrFull(e.target.value)}
                  placeholder="Nama jalan, nomor rumah/kamar, kelurahan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1">
                  Patokan untuk Kurir
                </label>
                <input
                  type="text"
                  value={newAddrLandmark}
                  onChange={(e) => setNewAddrLandmark(e.target.value)}
                  placeholder="Contoh: Pagar kayu coklat depan masjid"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_6px_16px_-4px_rgba(0,149,255,0.4)] transition cursor-pointer"
              >
                + Simpan Alamat Baru
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PREFERENSI CUCIAN & PROTOKOL TREATMENT */}
        {activeTab === 'preferensi' && (
          <form
            onSubmit={handleSavePreferences}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-6"
          >
            <div>
              <h3 className="text-base font-extrabold text-[#111827]">
                Standar Perawatan Pakaian Pribadi (1 Mesin 1 Pelanggan)
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Pengaturan ini otomatis diterapkan oleh operator produksi setiap kali cucian Anda masuk ke workshop kucek.id
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-2">
                  Aroma Parfum Default Pilihan Anda
                </label>
                <select
                  value={defaultScent}
                  onChange={(e) => setDefaultScent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                >
                  <option value="ocean_fresh">
                    Ocean Fresh (Segar Angin Laut & Tahan 14 Hari)
                  </option>
                  <option value="sakura_blossom">
                    Sakura Blossom (Floral Jepang Lembut & Elegan)
                  </option>
                  <option value="vanilla_mist">
                    Vanilla Mist (Aroma Manis Hangat Menenangkan)
                  </option>
                  <option value="lavender_calm">
                    Lavender Calm (Essential Oil untuk Sprei & Tidur)
                  </option>
                  <option value="no_perfume">
                    Tanpa Parfum (Khusus Bayi / Alergi Wewangian)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-2">
                  Standar Finishing & Pengemasan
                </label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                >
                  <option value="lipat_rapi">
                    Lipat Rapi Presisi + Kemas Kedap Debu
                  </option>
                  <option value="hanger_kemeja">
                    Gantung Hanger untuk Kemeja/Jas + Lipat Kaos
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                {
                  title: 'Pisahkan Pakaian Putih & Berwarna',
                  desc: 'Pakaian putih dicuci pada siklus terpisah agar tidak kelunturan',
                  checked: separateWhiteClothes,
                  onChange: () => setSeparateWhiteClothes(!separateWhiteClothes),
                },
                {
                  title: 'Deterjen Hypoallergenic Kulit Sensitif',
                  desc: 'Gunakan deterjen ramah kulit tanpa residu pemutih keras',
                  checked: hypoallergenicDetergent,
                  onChange: () =>
                    setHypoallergenicDetergent(!hypoallergenicDetergent),
                },
                {
                  title: 'Setrika Uap Suhu Lembut (Anti Mengkilap)',
                  desc: 'Perawatan uap aman untuk bahan rayon, sutra, dan kaos bersablon',
                  checked: gentleSteamIron,
                  onChange: () => setGentleSteamIron(!gentleSteamIron),
                },
                {
                  title: 'Gunakan Tas Laundry Reusable Eco-Bag',
                  desc: 'Kurir menjemput dan mengantar dengan tas kain higienis kucek.id',
                  checked: useEcoBag,
                  onChange: () => setUseEcoBag(!useEcoBag),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={item.onChange}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-[#0095FF]/40 bg-[#F9FAFC] flex items-center justify-between gap-4 cursor-pointer transition"
                >
                  <div>
                    <p className="text-xs font-extrabold text-[#111827]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{item.desc}</p>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                      item.checked ? 'bg-[#0095FF]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        item.checked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)] transition cursor-pointer"
              >
                Simpan Preferensi Cucian
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: GANTI PASSWORD & NOTIFIKASI */}
        {activeTab === 'keamanan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Cols: Ganti Kata Sandi */}
            <form
              onSubmit={handleChangePassword}
              className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0095FF] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">
                    Ganti Kata Sandi Akun
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Sandi akun seeder pelanggan saat ini: <b>user123</b>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-[#0095FF] cursor-pointer"
                  >
                    {showCurrentPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-[#0095FF] cursor-pointer"
                  >
                    {showNewPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Indikator kekuatan sandi */}
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${pwdStrength.color} ${pwdStrength.width}`}
                    />
                  </div>
                  <p className="text-[10.5px] font-semibold text-[#94A3B8] mt-1">
                    Kekuatan Sandi: <b className="text-slate-700">{pwdStrength.label}</b>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#111827] mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Perbarui Kata Sandi</span>
              </button>
            </form>

            {/* Right 6 Cols: Pengaturan Notifikasi WhatsApp & Sesi */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">
                    Notifikasi WhatsApp & Keamanan Sesi
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Atur pemberitahuan otomatis ke nomor {phone}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Notifikasi Keberangkatan Kurir via WhatsApp',
                    desc: 'Kirim pesan otomatis saat kurir menuju lokasi penjemputan / pengantaran',
                    checked: notifWhatsappCourier,
                    toggle: () => setNotifWhatsappCourier(!notifWhatsappCourier),
                  },
                  {
                    title: 'Update Tahap Produksi Real-Time',
                    desc: 'Beritahu saat cucian berpindah dari tahap Cuci, Kering, Setrika Uap hingga Selesai',
                    checked: notifProductionStage,
                    toggle: () => setNotifProductionStage(!notifProductionStage),
                  },
                  {
                    title: 'Pengingat Sisa Kuota Langganan (< 5 Kg)',
                    desc: 'Ingatkan otomatis saat saldo kuota kiloan Anda hampir habis',
                    checked: notifLowQuota,
                    toggle: () => setNotifLowQuota(!notifLowQuota),
                  },
                ].map((n, idx) => (
                  <div
                    key={idx}
                    onClick={n.toggle}
                    className="p-4 rounded-2xl border border-slate-100 bg-[#F9FAFC] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#111827]">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{n.desc}</p>
                    </div>
                    <div
                      className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${
                        n.checked ? 'bg-[#10B981]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          n.checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#F4F8FD] border border-[#E1EDFC] text-xs space-y-1">
                <p className="font-extrabold text-[#111827]">
                  Status Sesi Perangkat Saat Ini
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Terautentikasi dengan Token JWT & HttpOnly Cookie • macOS Safari • Aktif Sekarang
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
