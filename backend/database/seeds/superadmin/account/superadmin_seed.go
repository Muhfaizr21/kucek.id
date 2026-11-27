package account

import (
	"log"
	"time"

	userModel "kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/superadmin/package_catalog"

	"gorm.io/gorm"
)

func SeedSuperadmin(db *gorm.DB) {
	var adminUser userModel.User
	if err := db.Where("email = ?", "admin@kucek.id").First(&adminUser).Error; err != nil {
		superAdmin := userModel.User{
			Name:     "Superadmin Kucek",
			Email:    "admin@kucek.id",
			Phone:    "081234567890",
			Role:     userModel.RoleSuperAdmin,
			SubRole:  "Owner & Outlet Manager",
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

	// Seed Operational Staff
	staffMembers := []struct {
		Name    string
		Email   string
		Phone   string
		Role    userModel.Role
		SubRole string
	}{
		{
			Name:    "Andi Saputra",
			Email:   "andi.kasir@kucek.id",
			Phone:   "081234560001",
			Role:    userModel.RoleKasir,
			SubRole: "Front Desk & Kasir POS Shift Pagi",
		},
		{
			Name:    "Yayan Hendra",
			Email:   "yayan.operator@kucek.id",
			Phone:   "081234560002",
			Role:    userModel.RoleOperator,
			SubRole: "Spesialis Washer & Dryer Higienis",
		},
		{
			Name:    "Dina Lestari",
			Email:   "dina.setrika@kucek.id",
			Phone:   "081234560004",
			Role:    userModel.RoleOperator,
			SubRole: "Meja Setrika Uap & QC Packing",
		},
		{
			Name:    "Dedi Kurniawan",
			Email:   "dedi.kurir@kucek.id",
			Phone:   "081234560003",
			Role:    userModel.RoleKurir,
			SubRole: "Armada 01 - Zona Sleman & Kampus UGM",
		},
		{
			Name:    "Raka Pratama",
			Email:   "raka.kurir@kucek.id",
			Phone:   "081234560005",
			Role:    userModel.RoleKurir,
			SubRole: "Armada 02 - Zona Kota Yogyakarta & Bantul",
		},
	}

	for _, st := range staffMembers {
		var u userModel.User
		if err := db.Where("email = ?", st.Email).First(&u).Error; err != nil {
			newStaff := userModel.User{
				Name:     st.Name,
				Email:    st.Email,
				Phone:    st.Phone,
				Role:     st.Role,
				SubRole:  st.SubRole,
				IsActive: true,
			}
			_ = newStaff.SetPassword("staf123")
			db.Create(&newStaff)
		}
	}
}

func SeedExtraCustomers(db *gorm.DB) {
	var pkg30, pkg100 package_catalog.LaundryPackage
	db.Where("code = ?", "HEMAT-30").First(&pkg30)
	db.Where("code = ?", "SULTAN-100").First(&pkg100)

	exp30 := time.Now().AddDate(0, 0, 24)
	exp60 := time.Now().AddDate(0, 0, 52)

	var pkg30ID *uint
	if pkg30.ID != 0 {
		pkg30ID = &pkg30.ID
	}
	var pkg100ID *uint
	if pkg100.ID != 0 {
		pkg100ID = &pkg100.ID
	}

	extraCustomers := []profile.Customer{
		{
			Name:             "Anindya Putri",
			Phone:            "081398765432",
			Address:          "Kost Graha Asri No. 12, Pogung Kidul, Sleman",
			Area:             "Sleman (Zona Gratis Ongkir)",
			DefaultFragrance: "sakura_blossom",
			TotalOrders:      9,
			LoyaltyPoints:    450,
			TotalSavedRp:     65000,
			PackageID:        pkg30ID,
			RemainingQuota:   21.0,
			PackageExpiryAt:  &exp30,
		},
		{
			Name:             "Dimas Arya Wijaya",
			Phone:            "081223344556",
			Address:          "Apartemen Taman Melati Lt. 8 No. 14, Sinduadi, Sleman",
			Area:             "Sleman (Zona Gratis Ongkir)",
			DefaultFragrance: "ocean_fresh",
			TotalOrders:      14,
			LoyaltyPoints:    880,
			TotalSavedRp:     145000,
			PackageID:        pkg100ID,
			RemainingQuota:   64.5,
			PackageExpiryAt:  &exp60,
		},
		{
			Name:             "Sarah Amelia",
			Phone:            "085712345678",
			Address:          "Jl. Cendrawasih No. 22, Demangan Baru, Kota Yogyakarta",
			Area:             "Kota Yogyakarta (Zona Gratis Ongkir)",
			DefaultFragrance: "lavender_calm",
			TotalOrders:      4,
			LoyaltyPoints:    160,
			TotalSavedRp:     24000,
			RemainingQuota:   0,
		},
		{
			Name:             "Rian Pratama",
			Phone:            "081987654321",
			Address:          "Perum Griya Perwita Wisata Blok C4, Jalan Kaliurang KM 7",
			Area:             "Sleman (Zona Gratis Ongkir)",
			DefaultFragrance: "vanilla_mist",
			TotalOrders:      7,
			LoyaltyPoints:    310,
			TotalSavedRp:     38000,
			PackageID:        pkg30ID,
			RemainingQuota:   8.5,
			PackageExpiryAt:  &exp30,
		},
	}

	for _, cust := range extraCustomers {
		var existing profile.Customer
		if err := db.Where("phone = ?", cust.Phone).First(&existing).Error; err != nil {
			db.Create(&cust)
		}
	}
}
