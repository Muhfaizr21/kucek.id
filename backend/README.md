# kucek.id - Backend Service (Role & Feature-Driven MVC)

Backend service untuk platform **kucek.id** dibangun menggunakan **Golang 1.22+**, **Gin Web Framework**, **GORM ORM**, dan **PostgreSQL 16+** dengan pola arsitektur **`<layer>/<role>/<fitur>/<isi_fitur>.go`** yang modular, clean code, dan menerapkan prinsip SOLID.

---

## 🏗️ Struktur Folder (`<layer>/<role>/<fitur>/<isi_fitur>`)

```
backend/
├── main.go                                                   # Entrypoint aplikasi (go run main.go)
├── config/
│   ├── config.go                                             # Loader variabel lingkungan (.env)
│   └── database.go                                           # Koneksi PostgreSQL, pool, delegasi migrasi & seeder
├── controllers/                                              # Controller Layer per Role & Fitur
│   ├── public/
│   │   ├── auth/
│   │   │   ├── login_controller.go                           # Login & Logout
│   │   │   └── register_controller.go                        # Register & Me
│   │   ├── catalog/
│   │   │   └── package_catalog_controller.go                 # Katalog paket publik
│   │   ├── health/
│   │   │   └── health_controller.go                          # Healthcheck service & ping DB
│   │   └── tracking/
│   │       └── tracking_controller.go                        # Lacak resi publik
│   ├── superadmin/
│   │   ├── customers/
│   │   │   └── customer_controller.go                        # Direktori pelanggan & detail
│   │   ├── dashboard/
│   │   │   └── stats_controller.go                           # KPI omzet & ringkasan antrean
│   │   ├── dispatch/
│   │   │   └── dispatch_controller.go                        # Jadwal penjemputan & pengantaran kurir
│   │   ├── finance/
│   │   │   └── finance_controller.go                         # Ringkasan laporan keuangan
│   │   ├── packages/
│   │   │   └── package_management_controller.go              # Kelola katalog paket langganan
│   │   ├── pos/
│   │   │   └── pos_order_controller.go                       # Kasir POS, list order & pembayaran
│   │   ├── production/
│   │   │   └── kanban_controller.go                          # Antrean produksi Kanban 6 tahap
│   │   └── staff/
│   │       └── staff_controller.go                           # Delegasi staf (kasir, operator, kurir)
│   └── pelanggan/
│       ├── dashboard/
│       │   └── customer_hub_controller.go                    # Ringkasan kuota & cucian aktif pelanggan
│       ├── history/
│       │   └── order_history_controller.go                   # Riwayat pesanan pelanggan
│       ├── pickup/
│       │   └── book_pickup_controller.go                     # Booking penjemputan cucian
│       └── subscription/
│           └── buy_package_controller.go                     # Pembelian & aktivasi paket kuota
├── models/                                                   # Model Layer per Role & Fitur
│   ├── auth/
│   │   └── account/
│   │       └── user_model.go                                 # Entitas User & Role
│   ├── public/
│   │   └── tracking/
│   │       └── tracking_model.go                             # Entitas TrackingLog
│   ├── superadmin/
│   │   ├── order/
│   │   │   └── order_model.go                                # Entitas Order & OrderItem
│   │   └── package_catalog/
│   │       └── package_model.go                              # Entitas LaundryPackage
│   └── pelanggan/
│       └── profile/
│           └── customer_model.go                             # Entitas Customer
├── views/                                                    # View / DTO Layer per Role & Fitur
│   ├── common/
│   │   └── response/
│   │       └── json_response.go                              # Formatter JSON standar API
│   ├── public/
│   │   ├── auth/
│   │   │   └── auth_dto.go
│   │   └── tracking/
│   │       └── tracking_dto.go
│   ├── superadmin/
│   │   ├── packages/
│   │   │   └── package_dto.go
│   │   ├── pos/
│   │   │   └── pos_order_dto.go
│   │   ├── production/
│   │   │   └── kanban_dto.go
│   │   └── staff/
│   │       └── staff_dto.go
│   └── pelanggan/
│       ├── pickup/
│       │   └── pickup_dto.go
│       └── subscription/
│           └── buy_package_dto.go
├── routes/                                                   # Route Layer per Role & Fitur
│   ├── api.go                                                # Aggregator rute utama /api/v1
│   ├── public/
│   │   ├── auth/auth_routes.go
│   │   ├── catalog/catalog_routes.go
│   │   ├── health/health_routes.go
│   │   └── tracking/tracking_routes.go
│   ├── superadmin/
│   │   ├── customers/customer_routes.go
│   │   ├── dashboard/dashboard_routes.go
│   │   ├── dispatch/dispatch_routes.go
│   │   ├── finance/finance_routes.go
│   │   ├── packages/package_routes.go
│   │   ├── pos/pos_routes.go
│   │   ├── production/production_routes.go
│   │   └── staff/staff_routes.go
│   └── pelanggan/
│       ├── dashboard/hub_routes.go
│       ├── history/history_routes.go
│       ├── pickup/pickup_routes.go
│       └── subscription/subscription_routes.go
├── database/                                                 # Database Migrations & Seeds per Role
│   ├── migrations/
│   │   └── schema/
│   │       └── auto_migrate.go
│   └── seeds/
│       ├── seeder.go
│       ├── superadmin/
│       │   ├── account/superadmin_seed.go                    # Seeder Superadmin (admin@kucek.id / admin)
│       │   └── catalog/package_seed.go                       # Seeder 3 Paket Langganan
│       └── pelanggan/
│           ├── account/customer_seed.go                      # Seeder Pelanggan (user@kucek.id / user123)
│           └── order/sample_order_seed.go                    # Seeder Order & Timeline KCK-2026-001
└── middlewares/                                              # Middleware Layer per Scope & Fitur
    ├── auth/
    │   ├── jwt/jwt_middleware.go
    │   └── role/role_guard_middleware.go
    └── common/
        ├── cors/cors_middleware.go
        └── logger/request_logger.go
```

---

## 🚀 Cara Menjalankan Backend

```bash
cd backend
go run main.go
```

---

## 🔑 2 Akun Seeder Bawaan

1. **Superadmin (`role: superadmin`)**
   - Email: `admin@kucek.id`
   - Password: `admin`
   - Redirect: `/admin`
2. **User Pelanggan (`role: pelanggan`)**
   - Email: `user@kucek.id`
   - Password: `user123`
   - Redirect: `/app`
