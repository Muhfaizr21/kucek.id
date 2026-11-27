package config

import (
	"log"
	"time"

	"kucek-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(cfg *Config) (*gorm.DB, error) {
	dsn := cfg.GetDSN()

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	// Konfigurasi Connection Pooling
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("PostgreSQL connection established successfully to database:", cfg.DBName)

	DB = db

	// Auto-Migrate semua tabel sesuai model MVC
	if err := AutoMigrate(db); err != nil {
		log.Printf("Warning: auto-migration encountered an error: %v\n", err)
		return nil, err
	}

	// Seed data dasar jika tabel kosong
	seedInitialData(db)

	return DB, nil
}

func AutoMigrate(db *gorm.DB) error {
	log.Println("Running database auto-migrations for kucek.id...")
	return db.AutoMigrate(
		&models.User{},
		&models.LaundryPackage{},
		&models.Customer{},
		&models.Order{},
		&models.OrderItem{},
		&models.TrackingLog{},
	)
}

func seedInitialData(db *gorm.DB) {
	// 1. Seed Akun Superadmin jika belum ada
	var adminUser models.User
	if err := db.Where("email = ?", "admin@kucek.id").First(&adminUser).Error; err != nil {
		superAdmin := models.User{
			Name:     "Superadmin Kucek",
			Email:    "admin@kucek.id",
			Phone:    "081234567890",
			Role:     models.RoleSuperAdmin,
			SubRole:  "all",
			IsActive: true,
		}
		if err := superAdmin.SetPassword("admin"); err == nil {
			if err := db.Create(&superAdmin).Error; err == nil {
				log.Println("Superadmin user seeded: admin@kucek.id / admin")
			}
		}
	} else {
		if !adminUser.CheckPassword("admin") {
			_ = adminUser.SetPassword("admin")
			db.Save(&adminUser)
		}
	}

	// 2. Seed Akun Pelanggan (User) jika belum ada
	var customerUser models.User
	if err := db.Where("email = ?", "user@kucek.id").First(&customerUser).Error; err != nil {
		customerUser = models.User{
			Name:     "Budi Santoso",
			Email:    "user@kucek.id",
			Phone:    "081298765432",
			Role:     models.RolePelanggan,
			IsActive: true,
		}
		if err := customerUser.SetPassword("user123"); err == nil {
			if err := db.Create(&customerUser).Error; err == nil {
				log.Println("Customer user seeded: user@kucek.id / user123")
			}
		}
	} else {
		if !customerUser.CheckPassword("user123") {
			_ = customerUser.SetPassword("user123")
			db.Save(&customerUser)
		}
	}

	// 3. Seed Paket Langganan dasar jika belum ada
	var pkgCount int64
	db.Model(&models.LaundryPackage{}).Count(&pkgCount)
	if pkgCount == 0 {
		packages := []models.LaundryPackage{
			{
				Code:         "HEMAT-20",
				Name:         "Paket Mahasiswa Hemat",
				Description:  "Cocok untuk anak kos. Cuci, kering, setrika rapi wangi tahan lama.",
				Price:        130000,
				QuotaKg:      20,
				ValidityDays: 30,
				Features:     "Gratis antar-jemput,Parfum Vanilla Mist,Selesai 2 hari",
				IsPopular:    false,
				IsActive:     true,
			},
			{
				Code:         "KELUARGA-50",
				Name:         "Paket Keluarga Ceria",
				Description:  "Pilihan terfavorit keluarga muda. Prioritas mesin dan gratis laundry bed cover.",
				Price:        300000,
				QuotaKg:      50,
				ValidityDays: 45,
				Features:     "Prioritas antrean,Bebas pilih parfum,Gratis 1 bed cover,Antar jemput instan",
				IsPopular:    true,
				IsActive:     true,
			},
			{
				Code:         "SULTAN-100",
				Name:         "Paket Eksekutif Sultan",
				Description:  "Kuota besar untuk kebutuhan kantor atau keluarga besar tanpa batas repot.",
				Price:        550000,
				QuotaKg:      100,
				ValidityDays: 60,
				Features:     "Express 1 hari,Garansi 100% higienis,VIP courier dedicated,Free dry cleaning 2 stel",
				IsPopular:    false,
				IsActive:     true,
			},
		}
		for _, pkg := range packages {
			db.Create(&pkg)
		}
		log.Println("Default subscription packages seeded successfully.")
	}

	// 4. Seed Sample Customer Profile & Order jika belum ada, dan tautkan ke user@kucek.id
	var existingCust models.Customer
	if err := db.Where("phone = ?", "081298765432").First(&existingCust).Error; err == nil {
		if existingCust.UserID == nil && customerUser.ID != 0 {
			existingCust.UserID = &customerUser.ID
			db.Save(&existingCust)
		}
	}

	var orderCount int64
	db.Model(&models.Order{}).Count(&orderCount)
	if orderCount == 0 {
		var userIDPtr *uint
		if customerUser.ID != 0 {
			userIDPtr = &customerUser.ID
		}
		customer := models.Customer{
			UserID:         userIDPtr,
			Name:           "Budi Santoso",
			Phone:          "081298765432",
			Address:        "Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta",
			Area:           "Sleman",
			TotalOrders:    1,
			RemainingQuota: 15.5,
		}
		if err := db.Create(&customer).Error; err == nil {
			now := time.Now()
			sampleOrder := models.Order{
				OrderNumber:   "KCK-2026-001",
				CustomerID:    customer.ID,
				ServiceType:   "kiloan",
				WeightKg:      4.5,
				Fragrance:     "ocean_fresh",
				PricePerKg:    8000,
				Subtotal:      36000,
				Discount:      0,
				DeliveryFee:   0,
				TotalAmount:   36000,
				Status:        models.StatusSetrika,
				PaymentStatus: models.PaymentPaid,
				PaymentMethod: "qris",
				Notes:         "Kemeja putih mohon dipisah",
				CreatedAt:     now.Add(-4 * time.Hour),
			}
			if err := db.Create(&sampleOrder).Error; err == nil {
				// Seed tracking logs
				logs := []models.TrackingLog{
					{
						OrderID:     sampleOrder.ID,
						OrderNumber: sampleOrder.OrderNumber,
						Status:      string(models.StatusTerima),
						Title:       "Cucian Diterima Kasir",
						Description: "Laundry ditimbang 4.5 Kg dan diberi tag barcode identitas.",
						Location:    "Kucek Hub Kaliurang",
						UpdatedBy:   "Superadmin Kucek",
						Timestamp:   now.Add(-4 * time.Hour),
					},
					{
						OrderID:     sampleOrder.ID,
						OrderNumber: sampleOrder.OrderNumber,
						Status:      string(models.StatusCuci),
						Title:       "Proses Pencucian (1 Mesin 1 Pelanggan)",
						Description: "Dicuci dengan deterjen ramah serat dan pelembut Ocean Fresh.",
						Location:    "Ruang Produksi Mesin A2",
						UpdatedBy:   "Operator Produksi",
						Timestamp:   now.Add(-3 * time.Hour),
					},
					{
						OrderID:     sampleOrder.ID,
						OrderNumber: sampleOrder.OrderNumber,
						Status:      string(models.StatusKering),
						Title:       "Pengeringan Tabung Panas",
						Description: "Suhu terkontrol 60 derajat celcius, bebas debu luar.",
						Location:    "Ruang Pengering Dryer B1",
						UpdatedBy:   "Operator Produksi",
						Timestamp:   now.Add(-2 * time.Hour),
					},
					{
						OrderID:     sampleOrder.ID,
						OrderNumber: sampleOrder.OrderNumber,
						Status:      string(models.StatusSetrika),
						Title:       "Setrika Uap & Quality Control",
						Description: "Sedang di-steam dan dilipat rapi sesuai standar kerapian kucek.id.",
						Location:    "Meja Finishing",
						UpdatedBy:   "Staff Finishing",
						Timestamp:   now.Add(-30 * time.Minute),
					},
				}
				for _, l := range logs {
					db.Create(&l)
				}
			}
		}
	}
}
