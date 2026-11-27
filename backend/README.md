# kucek.id - Backend Service

Backend service untuk platform **kucek.id** dibangun menggunakan **Golang 1.22+**, **Gin Web Framework**, **GORM ORM**, dan **PostgreSQL 16+** dengan arsitektur **MVC (Model-View-Controller)** yang modular, clean code, dan berorientasi keamanan (OWASP Top 10).

---

## 🏗️ Struktur Arsitektur MVC

```
backend/
├── cmd/
│   └── api/
│       └── main.go           # Entrypoint aplikasi HTTP server & bootstrap
├── config/
│   ├── config.go             # Loader variabel lingkungan (.env)
│   └── database.go           # Koneksi PostgreSQL, connection pool, auto-migration & seeder
├── models/                   # GORM Data Models & Entity DB
│   ├── user.go               # Entitas akun, bcrypt password, enum role (superadmin, pelanggan, dll)
│   ├── customer.go           # Profil pelanggan, alamat, kuota langganan
│   ├── package.go            # Katalog paket langganan kucek.id
│   ├── order.go              # Transaksi pesanan, POS kiloan/satuan, relasi items
│   └── tracking.go           # Riwayat timeline lacak resi per status produksi
├── views/                    # DTOs, Serializers & JSON Formatters
│   ├── response.go           # Standard format JSON (success, message, data, error)
│   ├── auth_dto.go           # Request & response payload autentikasi
│   └── order_dto.go          # Request & response payload pesanan & POS
├── controllers/              # Handlers penerima HTTP request (Controller layer)
│   ├── health_controller.go   # Healthcheck service & ping database
│   ├── auth_controller.go     # Login, register, me, logout (JWT & HttpOnly)
│   ├── order_controller.go    # Manajemen pesanan, POS kasir, update status produksi
│   ├── customer_controller.go # Direktori pelanggan & kuota
│   ├── package_controller.go  # Katalog paket & aktivasi langganan
│   ├── tracking_controller.go # Tracking publik per nomor resi
│   └── stats_controller.go    # KPI dashboard superadmin (pendapatan, antrean)
├── routes/
│   └── api.go                # Registrasi rute endpoint API v1 & middleware
├── middlewares/              # Interceptors
│   ├── cors.go               # Cross-Origin Resource Sharing (port frontend 5173/3000)
│   ├── auth.go               # Verifikasi token JWT & claims
│   └── logger.go             # Logging request waktu respon & IP
├── .env.example              # Template variabel lingkungan
├── go.mod                    # Modul Go & dependencies
└── go.sum                    # Checksum dependensi Go
```

---

## 🗄️ Konfigurasi Database (PostgreSQL / DBeaver)

Pastikan service PostgreSQL berjalan lokal pada port `5432` dengan database `kucek`:

```env
PORT=8080
ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=muhfaiizr
DB_PASSWORD=admin
DB_NAME=kucek
DB_SSLMODE=disable
JWT_SECRET=kucek_secret_key_jwt_superadmin_clean_2026_super_safe
JWT_EXPIRY_HOURS=72
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🚀 Cara Menjalankan Backend

1. **Unduh dependensi:**
   ```bash
   cd backend
   go mod download
   ```

2. **Jalankan server pengembangan:**
   ```bash
   go run cmd/api/main.go
   ```

3. **Build binary produksi:**
   ```bash
   go build -o bin/server cmd/api/main.go
   ./bin/server
   ```

Server akan otomatis membuat tabel (Auto-Migration) di PostgreSQL dan melakukan seeding akun Superadmin bawaan jika database masih kosong.

---

## 🔑 Kredensial Bawaan (Default Seed)

- **Superadmin:**
  - Email: `admin@kucek.id`
  - Password: `admin`
  - Role: `superadmin` (Hak akses penuh seluruh modul)

---

## 📡 Daftar Endpoint Utama

| Metode | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `GET` | `/api/v1/health` | Ping status server & database | Publik |
| `GET` | `/api/v1/packages` | Daftar paket langganan aktif | Publik |
| `GET` | `/api/v1/track/:order_number` | Lacak pesanan via resi | Publik |
| `POST` | `/api/v1/auth/login` | Login user & generate JWT token | Publik |
| `POST` | `/api/v1/auth/register` | Pendaftaran pelanggan baru | Publik |
| `GET` | `/api/v1/auth/me` | Profil pengguna saat ini | Authenticated |
| `GET` | `/api/v1/orders` | Daftar semua pesanan | Superadmin / Staf |
| `POST` | `/api/v1/orders` | Input transaksi baru (Kasir POS) | Superadmin / Staf |
| `PATCH` | `/api/v1/orders/:id/status` | Update progres pengerjaan (Kanban) | Superadmin / Staf |
| `GET` | `/api/v1/stats/dashboard` | Statistik omzet & antrean aktif | Superadmin |
