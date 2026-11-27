package catalog

import (
	"log"

	"kucek-backend/models/superadmin/service_catalog"

	"gorm.io/gorm"
)

func SeedServiceItems(db *gorm.DB) {
	items := []service_catalog.ServiceItem{
		{
			Code:           "KILOAN-REG",
			Name:           "Cuci Setrika Kiloan Reguler",
			Category:       "KILOAN",
			Price:          8000,
			Unit:           "kg",
			Description:    "Cuci bersih 1 mesin 1 pelanggan, pengering higienis, setrika uap rapi & parfum tahan 14 hari",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      1,
		},
		{
			Code:           "KILOAN-EXP",
			Name:           "Cuci Setrika Express 24 Jam",
			Category:       "KILOAN",
			Price:          12000,
			Unit:           "kg",
			Description:    "Prioritas antrean mesin pertama, selesai dalam 24 jam dengan standar setrika uap presisi",
			EstimatedHours: 24,
			IsActive:       true,
			SortOrder:      2,
		},
		{
			Code:           "KILOAN-CKL",
			Name:           "Cuci Kering Lipat (Tanpa Setrika)",
			Category:       "KILOAN",
			Price:          6000,
			Unit:           "kg",
			Description:    "Cocok untuk pakaian santai harian & kaos, dicuci higienis dan dilipat rapi presisi",
			EstimatedHours: 36,
			IsActive:       true,
			SortOrder:      3,
		},
		{
			Code:           "SAT-BEDCOVER-M",
			Name:           "Bedcover Sedang (Single/Queen)",
			Category:       "SATUAN",
			Price:          25000,
			Unit:           "pcs",
			Description:    "Deep clean anti-tungau suhu 60°C + kemas plastik vakum kedap debu",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      4,
		},
		{
			Code:           "SAT-BEDCOVER-XL",
			Name:           "Bedcover King / Super King",
			Category:       "SATUAN",
			Price:          35000,
			Unit:           "pcs",
			Description:    "Pencucian mesin kapasitas jumbo + sterilisasi UV & kemas vakum eksklusif",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      5,
		},
		{
			Code:           "SAT-JAS-BLAZER",
			Name:           "Jas / Blazer / Kebaya Formal",
			Category:       "SATUAN",
			Price:          30000,
			Unit:           "pcs",
			Description:    "Dry clean lembut menjaga serat kain premium + gantung hanger & cover jas",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      6,
		},
		{
			Code:           "SAT-SNEAKERS",
			Name:           "Sepatu Sneakers Deep Clean",
			Category:       "SEPATU_HELM",
			Price:          35000,
			Unit:           "pasang",
			Description:    "Pembersihan midsole, upper, insole + deodorizer anti-bakteri & pengeringan khusus",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      7,
		},
		{
			Code:           "SAT-SELIMUT",
			Name:           "Selimut Tebal / Sprei Set",
			Category:       "SATUAN",
			Price:          20000,
			Unit:           "pcs",
			Description:    "Pencucian lembut pelembut serat + aroma terapi lavender tidur nyenyak",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      8,
		},
		{
			Code:           "SAT-GORDEN",
			Name:           "Gorden &Tirai Jendela",
			Category:       "RUMAH_TANGGA",
			Price:          15000,
			Unit:           "m2",
			Description:    "Pembersihan debu menahun & uap sterilisasi lipatan gorden",
			EstimatedHours: 72,
			IsActive:       true,
			SortOrder:      9,
		},
		{
			Code:           "SAT-BONEKA",
			Name:           "Boneka Besar / Bantal Bulu",
			Category:       "SATUAN",
			Price:          25000,
			Unit:           "pcs",
			Description:    "Deterjen hypoallergenic aman untuk anak & pengeringan ekstra mengembang",
			EstimatedHours: 48,
			IsActive:       true,
			SortOrder:      10,
		},
		{
			Code:           "SAT-HELM",
			Name:           "Cuci Helm Bogo / Full Face",
			Category:       "SEPATU_HELM",
			Price:          25000,
			Unit:           "pcs",
			Description:    "Cuci busa interior anti-jamur, poles visor bening & sanitasi ozon",
			EstimatedHours: 24,
			IsActive:       true,
			SortOrder:      11,
		},
		{
			Code:           "SAT-KARPET",
			Name:           "Karpet Ruangan Tebal",
			Category:       "RUMAH_TANGGA",
			Price:          30000,
			Unit:           "m2",
			Description:    "Shampooing karpet mesin polisher + bilas ekstraktor vakum hingga kering",
			EstimatedHours: 72,
			IsActive:       true,
			SortOrder:      12,
		},
	}

	for _, item := range items {
		var existing service_catalog.ServiceItem
		if err := db.Where("code = ?", item.Code).First(&existing).Error; err != nil {
			if err := db.Create(&item).Error; err != nil {
				log.Printf("Failed seeding service item %s: %v", item.Code, err)
			}
		}
	}
}
