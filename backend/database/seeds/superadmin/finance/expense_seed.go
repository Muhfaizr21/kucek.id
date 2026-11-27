package finance

import (
	"log"
	"time"

	financeModel "kucek-backend/models/superadmin/finance"

	"gorm.io/gorm"
)

func SeedExpenses(db *gorm.DB) {
	var count int64
	db.Model(&financeModel.Expense{}).Count(&count)
	if count > 0 {
		return
	}

	now := time.Now()
	expenses := []financeModel.Expense{
		{
			Title:         "Restock Deterjen Cair Higienis & Parfum (Sakura, Ocean, Lavender)",
			Category:      "BAHAN_BAKU",
			Amount:        68000,
			PaymentMethod: "Transfer BCA",
			ExpenseDate:   now.AddDate(0, 0, -4),
			PIC:           "Andi Saputra (Kasir)",
			Notes:         "Pembelian 4 jerigen deterjen ramah lingkungan & 2 liter bibit parfum murni",
		},
		{
			Title:         "Token Listrik Workshop & Air PDAM Mingguan",
			Category:      "UTILITAS",
			Amount:        85000,
			PaymentMethod: "QRIS / M-Banking",
			ExpenseDate:   now.AddDate(0, 0, -3),
			PIC:           "Superadmin Owner",
			Notes:         "Operasional 6 mesin washer front-loading & 4 mesin dryer suhu 60°C",
		},
		{
			Title:         "Plastik Packing Segel Kedap, Hanger & Tag Barcode Tahan Air",
			Category:      "KEMASAN",
			Amount:        42000,
			PaymentMethod: "Tunai Kasir",
			ExpenseDate:   now.AddDate(0, 0, -2),
			PIC:           "Yayan Hendra (Operator)",
			Notes:         "3 roll plastik HD buram sablon kucek.id + 10 pack hanger kemeja",
		},
		{
			Title:         "BBM & Insentif Harian Armada Kurir Antar-Jemput",
			Category:      "LOGISTIK_KURIR",
			Amount:        35000,
			PaymentMethod: "Tunai Kasir",
			ExpenseDate:   now.AddDate(0, 0, -1),
			PIC:           "Dedi Kurniawan (Kurir)",
			Notes:         "Reimbursement bensin penjemputan area Sleman, UGM & Kota Yogyakarta",
		},
		{
			Title:         "Pembersihan Filter & Perawatan Berkala Boiler Setrika Uap",
			Category:      "PERAWATAN_MESIN",
			Amount:        50000,
			PaymentMethod: "Transfer Bank",
			ExpenseDate:   now,
			PIC:           "Teknisi Workshop",
			Notes:         "Kuras kerak kalsium tabung boiler uap 25 liter agar tekanan uap stabil",
		},
	}

	for _, exp := range expenses {
		if err := db.Create(&exp).Error; err != nil {
			log.Printf("Failed seeding expense %s: %v", exp.Title, err)
		}
	}
}
