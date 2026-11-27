package order

import (
	"time"

	userModel "kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"
	orderModel "kucek-backend/models/superadmin/order"
	"kucek-backend/models/superadmin/package_catalog"

	"gorm.io/gorm"
)

func SeedSampleOrder(db *gorm.DB, customerUser *userModel.User) {
	var userIDPtr *uint
	if customerUser != nil && customerUser.ID != 0 {
		userIDPtr = &customerUser.ID
	}

	var customer profile.Customer
	if err := db.Where("user_id = ?", userIDPtr).First(&customer).Error; err != nil {
		// Hubungkan ke Paket Keluarga Ceria jika tersedia
		var pkg package_catalog.LaundryPackage
		var pkgIDPtr *uint
		var expiryPtr *time.Time
		if errPkg := db.Where("code = ?", "KELUARGA-50").First(&pkg).Error; errPkg == nil {
			pkgIDPtr = &pkg.ID
			exp := time.Now().AddDate(0, 0, 32)
			expiryPtr = &exp
		}

		customer = profile.Customer{
			UserID:           userIDPtr,
			Name:             "Budi Santoso",
			Phone:            "081298765432",
			Address:          "Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta",
			Area:             "Sleman",
			DefaultFragrance: "ocean_fresh",
			TotalOrders:      6,
			LoyaltyPoints:    320,
			TotalSavedRp:     42000,
			PackageID:        pkgIDPtr,
			RemainingQuota:   15.5,
			PackageExpiryAt:  expiryPtr,
		}
		db.Create(&customer)
	}

	now := time.Now()
	seedOrders := []struct {
		Order orderModel.Order
		Logs  []tracking.TrackingLog
	}{
		{
			Order: orderModel.Order{
				OrderNumber:   "KCK-2026-001",
				CustomerID:    customer.ID,
				ServiceType:   "kiloan",
				WeightKg:      4.5,
				Fragrance:     "ocean_fresh",
				PricePerKg:    8000,
				Subtotal:      36000,
				Discount:      0,
				TotalAmount:   36000,
				Status:        orderModel.StatusSetrika,
				PaymentStatus: orderModel.PaymentPaid,
				PaymentMethod: "qris",
				Notes:         "Kemeja putih mohon dipisah • Kurir: Raka Pratama",
				CreatedAt:     now.Add(-4 * time.Hour),
			},
			Logs: []tracking.TrackingLog{
				{
					OrderNumber: "KCK-2026-001",
					Status:      string(orderModel.StatusTerima),
					Title:       "Cucian Diterima Kasir",
					Description: "Laundry ditimbang 4.50 Kg dan diberi tag barcode identitas.",
					Location:    "Kucek Hub Kaliurang",
					UpdatedBy:   "Superadmin Kucek",
					Timestamp:   now.Add(-4 * time.Hour),
				},
				{
					OrderNumber: "KCK-2026-001",
					Status:      string(orderModel.StatusCuci),
					Title:       "Proses Pencucian (1 Mesin 1 Pelanggan)",
					Description: "Dicuci dengan deterjen ramah serat dan pelembut Ocean Fresh.",
					Location:    "Ruang Produksi Mesin A2",
					UpdatedBy:   "Operator Produksi (Dedi)",
					Timestamp:   now.Add(-3 * time.Hour),
				},
				{
					OrderNumber: "KCK-2026-001",
					Status:      string(orderModel.StatusKering),
					Title:       "Pengeringan Tabung Panas 60°C",
					Description: "Suhu terkontrol 60 derajat celcius, bebas debu luar.",
					Location:    "Ruang Pengering Dryer B1",
					UpdatedBy:   "Operator Produksi (Dedi)",
					Timestamp:   now.Add(-2 * time.Hour),
				},
				{
					OrderNumber: "KCK-2026-001",
					Status:      string(orderModel.StatusSetrika),
					Title:       "Setrika Uap & Quality Control",
					Description: "Sedang di-steam dan dilipat rapi sesuai standar kerapian kucek.id.",
					Location:    "Meja Finishing",
					UpdatedBy:   "Staff Finishing (Dina)",
					Timestamp:   now.Add(-30 * time.Minute),
				},
			},
		},
		{
			Order: orderModel.Order{
				OrderNumber:   "KCK-2026-002",
				CustomerID:    customer.ID,
				ServiceType:   "satuan",
				WeightKg:      2.0,
				Fragrance:     "sakura_blossom",
				PricePerKg:    32500,
				Subtotal:      65000,
				Discount:      0,
				TotalAmount:   65000,
				Status:        orderModel.StatusCuci,
				PaymentStatus: orderModel.PaymentUnpaid,
				PaymentMethod: "qris",
				Notes:         "Dry Clean Jas & Blazer Eksekutif (2 Stel) • Gantung Hanger",
				CreatedAt:     now.AddDate(0, 0, -2),
			},
			Logs: []tracking.TrackingLog{
				{
					OrderNumber: "KCK-2026-002",
					Status:      string(orderModel.StatusTerima),
					Title:       "Jas & Blazer Diterima di Outlet",
					Description: "Pengecekan serat kain wol dan kancing jas sebelum dry clean.",
					Location:    "Kucek Hub Kaliurang",
					UpdatedBy:   "Kasir Outlet",
					Timestamp:   now.AddDate(0, 0, -2),
				},
				{
					OrderNumber: "KCK-2026-002",
					Status:      string(orderModel.StatusCuci),
					Title:       "Proses Dry Cleaning Khusus",
					Description: "Pembersihan kimia ramah serat tanpa merusak struktur jas.",
					Location:    "Stasiun Dry Clean",
					UpdatedBy:   "Spesialis Dry Clean (Reza)",
					Timestamp:   now.AddDate(0, 0, -2).Add(2 * time.Hour),
				},
			},
		},
		{
			Order: orderModel.Order{
				OrderNumber:   "KCK-2026-003",
				CustomerID:    customer.ID,
				ServiceType:   "kiloan",
				WeightKg:      5.0,
				Fragrance:     "lavender_calm",
				PricePerKg:    8000,
				Subtotal:      40000,
				Discount:      8000,
				VoucherCode:   "KUCEKHEMAT20",
				TotalAmount:   32000,
				Status:        orderModel.StatusTerima,
				PaymentStatus: orderModel.PaymentPaid,
				PaymentMethod: "qris",
				Notes:         "Jemput Cucian Gelombang Sore • Kurir: Andi Wijaya (Armada 02)",
				CreatedAt:     now.Add(-90 * time.Minute),
			},
			Logs: []tracking.TrackingLog{
				{
					OrderNumber: "KCK-2026-003",
					Status:      string(orderModel.StatusTerima),
					Title:       "Dijemput Armada Kurir 02",
					Description: "Cucian 5.0 Kg telah dijemput oleh Kurir Andi Wijaya menuju Kucek Hub.",
					Location:    "Jl. Kaliurang KM 5 No. 12",
					UpdatedBy:   "Kurir Andi Wijaya",
					Timestamp:   now.Add(-90 * time.Minute),
				},
			},
		},
		{
			Order: orderModel.Order{
				OrderNumber:   "KCK-2026-004",
				CustomerID:    customer.ID,
				ServiceType:   "satuan",
				WeightKg:      6.0,
				Fragrance:     "vanilla_mist",
				PricePerKg:    7500,
				Subtotal:      45000,
				Discount:      10000,
				VoucherCode:   "PARFUMPREMIUM",
				TotalAmount:   35000,
				Status:        orderModel.StatusSelesai,
				PaymentStatus: orderModel.PaymentPaid,
				PaymentMethod: "qris",
				Notes:         "Bed Cover King Size + Sprei Set • Selesai Diantar",
				CreatedAt:     now.AddDate(0, 0, -5),
			},
			Logs: []tracking.TrackingLog{
				{
					OrderNumber: "KCK-2026-004",
					Status:      string(orderModel.StatusSelesai),
					Title:       "Selesai Diantar ke Pelanggan",
					Description: "Bed cover telah diterima dalam kemasan vakum higienis.",
					Location:    "Jl. Kaliurang KM 5 No. 12",
					UpdatedBy:   "Kurir Raka Pratama",
					Timestamp:   now.AddDate(0, 0, -4),
				},
			},
		},
		{
			Order: orderModel.Order{
				OrderNumber:   "KCK-2026-005",
				CustomerID:    customer.ID,
				ServiceType:   "kiloan",
				WeightKg:      5.2,
				Fragrance:     "sakura_blossom",
				PricePerKg:    8000,
				Subtotal:      41600,
				QuotaUsedKg:   5.2,
				TotalAmount:   0,
				Status:        orderModel.StatusSelesai,
				PaymentStatus: orderModel.PaymentPaid,
				PaymentMethod: "kuota_langganan",
				Notes:         "Cuci Lipat Reguler (Potong Kuota Paket) • Selesai",
				CreatedAt:     now.AddDate(0, 0, -9),
			},
			Logs: []tracking.TrackingLog{
				{
					OrderNumber: "KCK-2026-005",
					Status:      string(orderModel.StatusSelesai),
					Title:       "Cucian Selesai & Diserahterimakan",
					Description: "Pemotongan kuota langganan sebesar 5.20 Kg berhasil.",
					Location:    "Kucek Hub Kaliurang",
					UpdatedBy:   "Kasir Outlet",
					Timestamp:   now.AddDate(0, 0, -8),
				},
			},
		},
		{
			Order: orderModel.Order{
				OrderNumber:   "KCK-2026-006",
				CustomerID:    customer.ID,
				ServiceType:   "kiloan",
				WeightKg:      3.5,
				Fragrance:     "ocean_fresh",
				PricePerKg:    10000,
				Subtotal:      35000,
				TotalAmount:   35000,
				Status:        orderModel.StatusSelesai,
				PaymentStatus: orderModel.PaymentPaid,
				PaymentMethod: "qris",
				Notes:         "Express 1 Hari Selesai (3.5 Kg)",
				CreatedAt:     now.AddDate(0, 0, -14),
			},
			Logs: []tracking.TrackingLog{
				{
					OrderNumber: "KCK-2026-006",
					Status:      string(orderModel.StatusSelesai),
					Title:       "Layanan Express 24 Jam Selesai",
					Description: "Cucian Express diselesaikan tepat waktu dalam 18 jam.",
					Location:    "Jl. Kaliurang KM 5 No. 12",
					UpdatedBy:   "Kurir Raka Pratama",
					Timestamp:   now.AddDate(0, 0, -13),
				},
			},
		},
	}

	for _, item := range seedOrders {
		var existing orderModel.Order
		if err := db.Where("order_number = ?", item.Order.OrderNumber).First(&existing).Error; err != nil {
			if errCreate := db.Create(&item.Order).Error; errCreate == nil {
				for _, l := range item.Logs {
					l.OrderID = item.Order.ID
					db.Create(&l)
				}
			}
		}
	}
}
