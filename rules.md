# RULES.MD — STANDAR CODING, ARSITEKTUR SOLID & KEAMANAN
## Platform: kucek.id (Golang Backend + React.js Frontend)

> **PRINSIP UTAMA:**
> 1. Kode harus bersih (*Clean Code*), mudah dibaca oleh manusia, dan minim duplikasi.
> 2. Menerapkan **SOLID Principles** secara ketat di Backend Go maupun Frontend React.
> 3. Menerapkan prinsip **Security-First (OWASP Top 10)**: Jangan pernah percaya input dari sisi klien!

---

## BAGIAN 1: STANDAR BACKEND GOLANG

### 1. Arsitektur Bersih (Clean / Hexagonal Architecture)
Backend Go diatur ke dalam layer terpisah dengan aturan dependensi mengarah ke dalam (*Inversion of Control*):

```
backend/
├── cmd/
│   └── api/
│       └── main.go                 # Entrypoint: Inisialisasi DB, router, dependency injection
├── internal/
│   ├── domain/                     # Entity, Enums, & Interface Kontrak (Nol dependensi eksternal)
│   │   ├── order.go
│   │   ├── customer.go
│   │   └── user.go
│   ├── handler/                    # HTTP Handlers / Controllers (Membaca HTTP request, memanggil service)
│   │   ├── http/
│   │   │   ├── order_handler.go
│   │   │   └── auth_handler.go
│   │   └── middleware/             # Auth, CORS, RateLimiter, AuditLog
│   ├── service/                    # Business Logic / Use Cases (Validasi bisnis, kalkulasi uang/kuota)
│   │   ├── order_service.go
│   │   └── package_service.go
│   └── repository/                 # Data Access Layer (Query PostgreSQL / Redis)
│       └── postgres/
│           ├── order_repository.go
│           └── customer_repository.go
└── pkg/                            # Reusable utilities (hash, jwt, escpos, validator)
```

---

### 2. Penerapan Prinsip SOLID di Golang

* **S — Single Responsibility Principle (SRP):**
  * Handler **HANYA** bertugas *parsing request*, validasi format, dan mengembalikan status HTTP. Handler dilarang memuat logika bisnis (seperti hitung diskon atau potong kuota).
  * Service **HANYA** mengurus aturan bisnis. Service tidak boleh tahu apakah request datang dari HTTP, gRPC, atau CLI.
  * Repository **HANYA** mengurus operasi query database SQL.
* **O — Open/Closed Principle (OCP):**
  * Modul terbuka untuk penambahan fitur tetapi tertutup untuk modifikasi kode inti. Contoh: Untuk menambah gateway pembayaran baru (dari QRIS Midtrans ke Xendit), buat implementasi interface baru tanpa mengacak-acak `order_service.go`.
* **L — Liskov Substitution Principle (LSP):**
  * Semua implementasi repository harus mematuhi interface domain secara konsisten. Jika ada `MockOrderRepository` untuk unit test, ia harus dapat menggantikan `PostgresOrderRepository` tanpa mengubah logika service.
* **I — Interface Segregation Principle (ISP):**
  * Buat interface kecil dan spesifik (*small interfaces*). Jangan buat interface raksasa:
    ```go
    // BENAR: Interface kecil dan spesifik
    type OrderReader interface {
        GetByID(ctx context.Context, id uuid.UUID) (*domain.Order, error)
    }

    type OrderWriter interface {
        Create(ctx context.Context, order *domain.Order) error
        UpdateStatus(ctx context.Context, id uuid.UUID, status domain.ProductionStatus) error
    }
    ```
* **D — Dependency Inversion Principle (DIP):**
  * Layer tingkat tinggi tidak boleh bergantung pada layer tingkat rendah; keduanya harus bergantung pada abstraksi (*interfaces*).
  * `OrderService` bergantung pada interface `OrderRepository`, bukan struct konkret `*PostgresOrderRepository`. Objek di-inject melalui constructor (`NewOrderService(repo domain.OrderRepository)`).

---

### 3. Konvensi Clean Code di Golang
1. **Error Handling Idiomatis:**
   * Selalu periksa `if err != nil`.
   * Lakukan *error wrapping* dengan konteks yang jelas: `return fmt.Errorf("failed to deduct customer package: %w", err)`.
   * Dilarang keras menggunakan `panic()` di kode *production* selain inisialisasi awal database di `main.go`.
2. **Context Propagation:**
   * Setiap fungsi I/O (database, panggilan HTTP ke WhatsApp gateway) **WAJIB** menerima `ctx context.Context` sebagai parameter pertama untuk *timeout* dan pembatalan request.
3. **Pemberian Nama (Naming Conventions):**
   * Gunakan `camelCase` untuk unexported dan `PascalCase` untuk exported.
   * Hindari nama variabel abstrak seperti `data`, `temp`, `res`. Gunakan nama bermakna: `activeOrder`, `customerQuota`.

---

## BAGIAN 2: STANDAR FRONTEND REACT.JS

### 1. Struktur Folder Berbasis Fitur (Feature-Based Structure)
```
frontend/src/
├── assets/             # Gambar, logo kucek.id, static icons
├── components/         # Komponen global reusable (Button, Modal, Input, Badge, Header)
│   └── ui/             # Shadcn primitives
├── features/           # Modul fitur terisolasi
│   ├── auth/           # Login, OTP verification
│   ├── pos/            # Kasir, input timbangan, grid satuan, keranjang belanja
│   ├── tracking/       # Live tracker cucian, progress bar, e-receipt
│   ├── production/     # Kanban board cuci/kering/setrika
│   └── subscription/   # Beli paket kuota, widget saldo
├── hooks/              # Global custom hooks (useBluetoothPrinter, useDebounce)
├── lib/                # Konfigurasi axios/fetch client, utils helper
├── routes/             # Definisi route & protected routes
└── types/              # TypeScript interface & API contracts
```

---

### 2. Penerapan Prinsip SOLID di React

* **S — Single Responsibility:**
  * Pisahkan antara **UI Rendering** dan **Business Logic/Data Fetching**.
  * Komponen UI hanya merender data: `PosCartView.tsx`.
  * Logika keranjang dan hitung harga diekstrak ke Custom Hook: `usePosCart.ts`.
* **O — Open/Closed:**
  * Buat komponen fleksibel melalui *composition* (`children` props atau slot props) daripada menambahkan puluhan parameter `if-else`.
* **I — Interface Segregation:**
  * Jangan berikan seluruh object raksasa `Order` ke komponen kecil jika komponen itu hanya butuh status:
    ```tsx
    // SALAH:
    <StatusBadge order={fullOrderObject} />

    // BENAR:
    <StatusBadge status={order.productionStatus} />
    ```

---

### 3. Konvensi Clean Code di React & TypeScript
1. **Strict TypeScript:**
   * Dilarang keras menggunakan tipe `any`. Jika tipe dinamis, gunakan `unknown` dengan *type narrowing*.
   * Selalu definisikan tipe props secara eksplisit menggunakan `interface` atau `type`.
2. **Kalkulasi Keuangan Akurat:**
   * Pembulatan berat timbangan desimal (kg) dan rupiah harus ditangani hati-hati agar tidak terjadi selisih angka sen/rupiah.
3. **Komponen Bersih:**
   * Usahakan satu file komponen tidak lebih dari 150-200 baris kode. Jika terlalu panjang, pecah menjadi sub-komponen kecil.

---

## BAGIAN 3: STANDAR KEAMANAN (SECURITY-FIRST / OWASP TOP 10)

Sistem laundry mengelola data pribadi pelanggan (nomor WhatsApp, alamat rumah) serta transaksi keuangan kasir. Keamanan adalah prioritas absolut.

---

### 1. Autentikasi & Manajemen Sesi (Session Security)
* **Penyimpanan Token:**
  * Token JWT **TIDAK BOLEH** disimpan di `localStorage` atau `sessionStorage` browser karena rentan pencurian via XSS (Cross-Site Scripting).
  * Token JWT **WAJIB** disimpan dalam cookie dengan flag:
    * `HttpOnly` (JavaScript tidak bisa membaca token).
    * `Secure` (Hanya dikirim lewat koneksi HTTPS terenkripsi).
    * `SameSite=Strict` atau `SameSite=Lax` (Mencegah serangan CSRF).
* **Refresh Token Rotation:**
  * Gunakan Access Token berumur pendek (15 menit) dan Refresh Token berumur lebih panjang (7 hari) yang dirotasi setiap kali digunakan.

---

### 2. Pencegahan SQL Injection
* **Aturan Mutlak:** Dilarang merangkai query database menggunakan format string dinamis seperti `fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)`.
* **Solusi Wajib:**
  * Gunakan *Parameterized Queries* / *Prepared Statements* via `sqlc` atau `pgx`:
    ```go
    // BENAR (Aman dari SQL Injection):
    row := db.QueryRow(ctx, "SELECT id, name FROM customers WHERE phone = $1", phone)
    ```

---

### 3. Otorisasi Ketat (Role-Based Access Control / RBAC)
* Setiap endpoint sensitif di backend Go **WAJIB** dilindungi oleh middleware verifikasi peran (*Role Middleware*):
  * Route `/api/v1/admin/*` &rarr; Wajib role `SUPERADMIN`.
  * Route `/api/v1/customer/*` &rarr; Wajib memastikan `customer_id` di URL/Payload cocok dengan `customer_id` di dalam klaim token JWT (mencegah IDOR - *Insecure Direct Object Reference*).

---

### 4. Pencegahan Serangan Brute Force & Rate Limiting
* Pasang **Rate Limiter Middleware** pada endpoint krusial:
  * Endpoint Login & Request OTP WhatsApp: Maksimal **5 request per menit per IP**.
  * Endpoint Cek Resi Publik: Maksimal **20 request per menit per IP** (mencegah scraping nomor resi).

---

### 5. Validasi Input Berlapis (Defense in Depth)
* **Di Frontend:** Validasi cepat dengan Zod untuk memberikan pengalaman pengguna yang responsif.
* **Di Backend (Penjaga Utama):** Validasi ulang 100% parameter menggunakan `go-playground/validator`.
  * Sanitasi teks catatan khusus untuk mencegah *XSS Injection*.
  * Pastikan berat timbangan tidak negatif dan tidak bernilai nol.

---

### 6. Keamanan Webhook Pembayaran & WhatsApp
* Setiap webhook masuk dari Payment Gateway (Midtrans/Xendit):
  * **Wajib validasi signature kriptografi** (HMAC-SHA512 dengan secret server) sebelum mengupdate status pembayaran order menjadi lunas.
  * Terapkan *idempotency check*: Jangan sampai callback pembayaran yang terkirim 2 kali memotong kuota pelanggan 2 kali!

---

### 7. Audit Logging untuk Operasi Sensitif Toko (Anti-Fraud)
* Operasi berikut wajib dicatat di tabel `AUDIT_LOGS` beserta user ID, IP, tanggal, dan alasannya:
  1. Pembatalan transaksi kasir (*Void order*).
  2. Pemberian diskon manual di luar kupon resmi.
  3. Perubahan harga dasar katalog layanan oleh Superadmin.
  4. Penyesuaian (*adjustment*) saldo kuota pelanggan secara manual.
