package account

import (
	"log"

	userModel "kucek-backend/models/auth/account"

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
}
