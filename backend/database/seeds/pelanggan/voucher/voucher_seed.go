package voucher

import (
	"time"

	"kucek-backend/models/pelanggan/profile"
	voucherModel "kucek-backend/models/pelanggan/voucher"

	"gorm.io/gorm"
)

func SeedVouchers(db *gorm.DB) {
	now := time.Now()
	defaultVouchers := []voucherModel.Voucher{
		{
			Code:          "KUCEKHEMAT20",
			Title:         "Diskon 20% Cuci Setrika Kiloan",
			Description:   "Potongan 20% untuk layanan Cuci Setrika Kiloan higienis 1 Mesin 1 Pelanggan.",
			Category:      "kiloan",
			DiscountType:  "percent",
			DiscountValue: 20,
			MaxDiscount:   25000,
			MinOrderValue: 24000,
			MinWeightKg:   3,
			TotalQuota:    100,
			UsedCount:     34,
			BadgeColor:    "blue",
			Terms:         "Minimal berat cucian 3 Kg • Maksimal potongan Rp 25.000 • Berlaku semua aroma parfum.",
			ValidUntil:    now.AddDate(0, 1, 15),
			IsActive:      true,
		},
		{
			Code:          "BEDCOVER30",
			Title:         "Diskon 30% Cuci Bed Cover & Satuan",
			Description:   "Hemat 30% khusus pencucian Bed Cover King/Queen, Jas, Kebaya, dan Jaket Kulit.",
			Category:      "satuan",
			DiscountType:  "percent",
			DiscountValue: 30,
			MaxDiscount:   40000,
			MinOrderValue: 30000,
			MinWeightKg:   1,
			TotalQuota:    75,
			UsedCount:     19,
			BadgeColor:    "emerald",
			Terms:         "Berlaku layanan Dry Clean & Satuan • Tanpa minimum berat • Gratis plastik vakum kedap udara.",
			ValidUntil:    now.AddDate(0, 1, 20),
			IsActive:      true,
		},
		{
			Code:          "ONGKIRGRATIS",
			Title:         "Gratis Jemput-Antar & Potongan Rp 12.000",
			Description:   "Subsidi langsung Rp 12.000 untuk pemesanan penjemputan kurir armada kucek.id.",
			Category:      "all",
			DiscountType:  "fixed",
			DiscountValue: 12000,
			MaxDiscount:   12000,
			MinOrderValue: 16000,
			MinWeightKg:   2,
			TotalQuota:    150,
			UsedCount:     62,
			BadgeColor:    "amber",
			Terms:         "Berlaku untuk seluruh gelombang kurir (Pagi, Siang, Sore) • Minimal cucian 2 Kg.",
			ValidUntil:    now.AddDate(0, 2, 0),
			IsActive:      true,
		},
		{
			Code:          "TOPUPHEMAT35",
			Title:         "Potongan Rp 35.000 Paket Kuota Keluarga",
			Description:   "Diskon langsung Rp 35.000 saat membeli atau top-up Paket Keluarga Ceria 50 Kg.",
			Category:      "paket",
			DiscountType:  "fixed",
			DiscountValue: 35000,
			MaxDiscount:   35000,
			MinOrderValue: 250000,
			MinWeightKg:   0,
			TotalQuota:    50,
			UsedCount:     21,
			BadgeColor:    "purple",
			Terms:         "Khusus pembelian paket langganan minimal Rp 250.000 via pembayaran QRIS.",
			ValidUntil:    now.AddDate(0, 1, 10),
			IsActive:      true,
		},
		{
			Code:          "PARFUMPREMIUM",
			Title:         "Diskon Rp 10.000 + Ekstra Parfum 14 Hari",
			Description:   "Potongan harga Rp 10.000 sekaligus double-spray parfum grade premium tahan 14 hari.",
			Category:      "all",
			DiscountType:  "fixed",
			DiscountValue: 10000,
			MaxDiscount:   10000,
			MinOrderValue: 32000,
			MinWeightKg:   4,
			TotalQuota:    120,
			UsedCount:     45,
			BadgeColor:    "rose",
			Terms:         "Minimal cucian 4 Kg • Berlaku untuk Ocean Fresh, Sakura Blossom, Vanilla, & Lavender.",
			ValidUntil:    now.AddDate(0, 1, 25),
			IsActive:      true,
		},
		{
			Code:          "SULTAN50K",
			Title:         "Cashback Langsung Rp 50.000 Paket Sultan",
			Description:   "Potongan eksklusif Rp 50.000 untuk aktivasi Paket Eksekutif Sultan 100 Kg.",
			Category:      "paket",
			DiscountType:  "fixed",
			DiscountValue: 50000,
			MaxDiscount:   50000,
			MinOrderValue: 500000,
			MinWeightKg:   0,
			TotalQuota:    40,
			UsedCount:     12,
			BadgeColor:    "blue",
			Terms:         "Berlaku untuk pembelian Paket Eksekutif Sultan 100 Kg • Kuota terbatas.",
			ValidUntil:    now.AddDate(0, 2, 10),
			IsActive:      true,
		},
	}

	for _, v := range defaultVouchers {
		var existing voucherModel.Voucher
		if err := db.Where("code = ?", v.Code).First(&existing).Error; err != nil {
			db.Create(&v)
		}
	}

	// Pastikan pelanggan utama (Budi Santoso) sudah memiliki 3 voucher aktif di dompetnya
	var customer profile.Customer
	if err := db.Order("id ASC").First(&customer).Error; err == nil {
		var claimedCount int64
		db.Model(&voucherModel.CustomerVoucher{}).Where("customer_id = ?", customer.ID).Count(&claimedCount)
		if claimedCount == 0 {
			preClaimCodes := []string{"KUCEKHEMAT20", "BEDCOVER30", "ONGKIRGRATIS"}
			for _, code := range preClaimCodes {
				var v voucherModel.Voucher
				if err := db.Where("code = ?", code).First(&v).Error; err == nil {
					cv := voucherModel.CustomerVoucher{
						CustomerID: customer.ID,
						VoucherID:  v.ID,
						Status:     "claimed",
						ClaimedAt:  now.Add(-24 * time.Hour),
					}
					db.Create(&cv)
				}
			}

			// Tambahkan 1 contoh riwayat voucher yang sudah terpakai
			var usedV voucherModel.Voucher
			if err := db.Where("code = ?", "PARFUMPREMIUM").First(&usedV).Error; err == nil {
				usedTime := now.AddDate(0, 0, -5)
				cvUsed := voucherModel.CustomerVoucher{
					CustomerID:      customer.ID,
					VoucherID:       usedV.ID,
					Status:          "used",
					ClaimedAt:       now.AddDate(0, 0, -7),
					UsedAt:          &usedTime,
					UsedOrderNumber: "KCK-2026-004",
					SavedAmount:     10000,
				}
				db.Create(&cvUsed)
			}
		}
	}
}
