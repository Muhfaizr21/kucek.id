# 🧺 kucek.id — Modern Laundry Management & Customer Experience Platform

<div align="center">

![kucek.id Banner](https://img.shields.io/badge/kucek.id-v1.0.0-0284c7?style=for-the-badge&logo=washing-machine&logoColor=white)
[![Go Version](https://img.shields.io/badge/Golang-1.22+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![React Version](https://img.shields.io/badge/React-19%20%7C%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Solusi manajemen operasional laundry modern berbasis web yang cepat, aman, dan berorientasi pada kepuasan pelanggan.</b>
  <br />
  Menggabungkan kecepatan kasir POS, otomatisasi pelacakan pengerjaan cuci, pencetakan nota thermal Bluetooth, serta portal mandiri pelanggan untuk pemesanan antar-jemput dan kuota langganan kiloan.
</p>

[Fitur Utama](#-fitur-utama) •
[Arsitektur](#-arsitektur-sistem) •
[Tech Stack](#-teknologi-yang-digunakan) •
[Dokumentasi Proyek](#-dokumentasi-lengkap) •
[Memulai](#-instalasi--menjalankan-secara-lokal) •
[Kontributor](#-kontributor)

---

</div>

## 💡 Tentang kucek.id

**kucek.id** dirancang untuk mentransformasi bisnis laundry konvensional (UMKM) menjadi bisnis modern terautomasi:
* **Bebas Ribet untuk Kasir & Owner:** Input pesanan kiloan/satuan di bawah 45 detik, kalkulasi otomatis batas minimum timbangan, serta pelacakan arus kas dan laba bersih tanpa celah kecurangan (*anti-fraud*).
* **Pengalaman Premium untuk Pelanggan:** Cek progres cucian secara *live* tanpa login rumit, beli paket kuota hemat bayar QRIS instan, pesan antar-jemput cucian, dan nikmati e-Nota digital yang rapi.

---

## 🚀 Fitur Utama

### 1. 🏢 Sisi Superadmin (All-in-One Store Management)
* **Point of Sale (POS) Cepat:** Input desimal timbangan kiloan, grid visual pakaian satuan, pemilihan durasi (Reguler/Kilat/Express), katalog aroma parfum, dan bukti foto kondisi pakaian rawan/luntur.
* **Cetak Struk Thermal (ESC/POS):** Koneksi langsung via Web Bluetooth API ke printer thermal 58mm/80mm (cetak 2 ply: nota pelanggan & label kantong pakaian).
* **Papan Antrean Pengerjaan (Production Kanban):** Pemantauan status cuci 5 tahap (*Antrean &rarr; Cuci &rarr; Kering &rarr; Setrika &rarr; QC & Packing &rarr; Siap Ambil*) dengan dukungan barcode scanner.
* **Manajemen Antar-Jemput (Pickup & Delivery Hub):** Monitor order penjemputan dari pelanggan dan penugasan kurir.
* **Sistem Paket Kuota Langganan Kiloan:** Jual paket kiloan hemat dan potong kuota otomatis saat pelanggan mencuci.
* **Laporan Arus Kas & Biaya:** Rekap uang kas laci per shift, rekap pembayaran QRIS, pencatatan biaya operasional toko (deterjen, gas, listrik), serta estimasi laba bersih.
* **Keamanan & Anti-Fraud:** Kebijakan pembatalan nota (*void*) berbasis otorisasi PIN dan pencatatan audit log permanen.
* **Manajemen Staf (Future-Proof):** Struktur hak akses siap pakai jika sewaktu-waktu ingin mengaktifkan akun kasir, operator, atau kurir terpisah.

### 2. 📱 Sisi Pelanggan (Customer Self-Service Portal)
* **Live Order Tracking:** Pelacakan progres cucian real-time (*live progress bar*) via link resi unik tanpa registrasi rumit.
* **Booking Antar-Jemput Mandiri:** Pesan penjemputan pakaian dari rumah/kos dengan pilihan slot waktu dan titik alamat.
* **Pembelian Paket Hemat Online:** Beli paket langganan kiloan langsung dari HP dan bayar via QRIS otomatis.
* **Arsip Riwayat & e-Invoice:** Unduh nota digital PDF resmi kapan saja untuk kebutuhan reimburse/catatan pribadi.
* **Preferensi Tersimpan:** Simpan aroma parfum favorit dan instruksi pakaian khusus otomatis.
* **Klaim Garansi 24 Jam:** Formulir komplain cuci ulang / ganti rugi dengan unggah bukti foto dalam 1x24 jam pasca pengambilan.

---

## 🏛 Arsitektur Sistem

Aplikasi ini menggunakan pola **Decoupled Monorepo** yang memisahkan frontend dan backend secara bersih:

```
kucek.id/
├── backend/            # Golang REST API Service (Clean / Hexagonal Architecture)
│   ├── cmd/api/        # Application Entrypoint
│   ├── internal/       # Domain Entities, Services, Handlers & Repositories
│   └── pkg/            # Reusable Utilities (JWT, Hashing, ESC/POS, Validator)
├── frontend/           # React.js SPA / PWA (TypeScript + Tailwind CSS v4)
│   ├── src/components/ # Reusable UI Components (Shadcn UI)
│   ├── src/features/   # Feature-Driven Modules (POS, Tracking, Production, Auth)
│   └── src/hooks/      # Custom Hooks (Web Bluetooth Printer, Cart Logic)
├── prd.md              # Product Requirements Document (Fitur 100% Komplit)
├── tech_stack.md       # Spesifikasi Teknis & Dependensi
├── rules.md            # Standar Clean Code, SOLID & Keamanan OWASP
└── README.md           # Dokumentasi Utama Repository
```

---

## 🛠 Teknologi yang Digunakan

### Backend (Core API)
* **Bahasa:** [Go (Golang) 1.22+](https://go.dev/)
* **HTTP Router:** [Chi Router (`go-chi/chi/v5`)](https://github.com/go-chi/chi)
* **Database:** [PostgreSQL 16](https://www.postgresql.org/)
* **SQL Engine:** [`sqlc`](https://sqlc.dev/) + [`pgx/v5`](https://github.com/jackc/pgx) (100% Type-Safe SQL, Nol Refleksi Runtime)
* **Migrasi Database:** [`golang-migrate`](https://github.com/golang-migrate/migrate)
* **Autentikasi:** JWT disimpan dalam `HttpOnly, Secure, SameSite=Strict` Cookies
* **Validasi:** `go-playground/validator/v10`

### Frontend (User Interface)
* **Framework:** [React 19 / 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Bahasa:** [TypeScript (Strict Mode)](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Komponen:** [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
* **Ikon:** [Lucide React](https://lucide.dev/)
* **Data Fetching & Cache:** [TanStack Query v5 (React Query)](https://tanstack.com/query)
* **Form Management:** React Hook Form + Zod

---

## 📚 Dokumentasi Lengkap

Seluruh dokumen pedoman pengerjaan dan standar proyek tersedia di direktori root:

* 📄 [PRD (Product Requirements Document)](prd.md) — Rincian lengkap seluruh fitur, alur bisnis, diagram alur, dan aturan bisnis.
* ⚙️ [Tech Stack Specification](tech_stack.md) — Panduan arsitektur teknologi, library pendukung, dan konfigurasi server.
* 🛡️ [Rules, Clean Code, SOLID & Security](rules.md) — Standar penulisan kode, pemisahan layer arsitektur, dan mitigasi keamanan (OWASP Top 10).

---

## 💻 Instalasi & Menjalankan Secara Lokal

### Prasyarat
* [Go 1.22+](https://go.dev/dl/)
* [Node.js 20+](https://nodejs.org/) & pnpm / npm
* [PostgreSQL 16](https://www.postgresql.org/download/)
* [Git](https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/Muhfaizr21/kucek.id.git
cd kucek.id
```

### 2. Setup Backend (Golang)
```bash
cd backend
# Salin konfigurasi environment
cp .env.example .env

# Unduh dependensi Go
go mod tidy

# Jalankan backend API langsung
go run main.go
```
*Backend API akan berjalan di `http://localhost:8080`*

### 3. Setup Frontend (React.js)
```bash
cd ../frontend
# Install dependensi
npm install # atau pnpm install

# Jalankan frontend dev server
npm run dev
```
*Frontend web akan berjalan di `http://localhost:5173`*

---

## 🔒 Standar Keamanan & Perlindungan Data

* **Anti XSS & CSRF:** Token JWT tidak disimpan di `localStorage`, melainkan `HttpOnly, Secure Cookies`.
* **Zero SQL Injection:** Seluruh query database menggunakan *Parameterized Prepared Statements* melalui `sqlc`.
* **Rate Limiting:** Proteksi brute-force pada endpoint otentikasi & OTP.
* **Audit Trail Anti-Fraud:** Pencatatan otomatis setiap aksi pembatalan nota (*void*), perubahan harga, atau diskon manual.

---

## 🤝 Kontributor & Lisensi

Dibuat dan dikembangkan oleh **[Muhfaizr21](https://github.com/Muhfaizr21)**.  
Didistribusikan di bawah lisensi **MIT License**.
