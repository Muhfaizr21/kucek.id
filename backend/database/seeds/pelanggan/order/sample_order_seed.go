package order

import (
	"time"

	userModel "kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"
	orderModel "kucek-backend/models/superadmin/order"

	"gorm.io/gorm"
)

func SeedSampleOrder(db *gorm.DB, customerUser *userModel.User) {
	var orderCount int64
	db.Model(&orderModel.Order{}).Count(&orderCount)
	if orderCount > 0 {
		return
	}

	var userIDPtr *uint
	if customerUser != nil && customerUser.ID != 0 {
		userIDPtr = &customerUser.ID
	}

	customer := profile.Customer{
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
		sampleOrder := orderModel.Order{
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
			Status:        orderModel.StatusSetrika,
			PaymentStatus: orderModel.PaymentPaid,
			PaymentMethod: "qris",
			Notes:         "Kemeja putih mohon dipisah",
			CreatedAt:     now.Add(-4 * time.Hour),
		}
		if err := db.Create(&sampleOrder).Error; err == nil {
			logs := []tracking.TrackingLog{
				{
					OrderID:     sampleOrder.ID,
					OrderNumber: sampleOrder.OrderNumber,
					Status:      string(orderModel.StatusTerima),
					Title:       "Cucian Diterima Kasir",
					Description: "Laundry ditimbang 4.5 Kg dan diberi tag barcode identitas.",
					Location:    "Kucek Hub Kaliurang",
					UpdatedBy:   "Superadmin Kucek",
					Timestamp:   now.Add(-4 * time.Hour),
				},
				{
					OrderID:     sampleOrder.ID,
					OrderNumber: sampleOrder.OrderNumber,
					Status:      string(orderModel.StatusCuci),
					Title:       "Proses Pencucian (1 Mesin 1 Pelanggan)",
					Description: "Dicuci dengan deterjen ramah serat dan pelembut Ocean Fresh.",
					Location:    "Ruang Produksi Mesin A2",
					UpdatedBy:   "Operator Produksi",
					Timestamp:   now.Add(-3 * time.Hour),
				},
				{
					OrderID:     sampleOrder.ID,
					OrderNumber: sampleOrder.OrderNumber,
					Status:      string(orderModel.StatusKering),
					Title:       "Pengeringan Tabung Panas",
					Description: "Suhu terkontrol 60 derajat celcius, bebas debu luar.",
					Location:    "Ruang Pengering Dryer B1",
					UpdatedBy:   "Operator Produksi",
					Timestamp:   now.Add(-2 * time.Hour),
				},
				{
					OrderID:     sampleOrder.ID,
					OrderNumber: sampleOrder.OrderNumber,
					Status:      string(orderModel.StatusSetrika),
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
