package catalog

import (
	"log"

	"kucek-backend/models/superadmin/package_catalog"

	"gorm.io/gorm"
)

func SeedLaundryPackages(db *gorm.DB) {
	var pkgCount int64
	db.Model(&package_catalog.LaundryPackage{}).Count(&pkgCount)
	if pkgCount == 0 {
		packages := []package_catalog.LaundryPackage{
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
}
