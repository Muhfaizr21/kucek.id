package account

import (
	"log"

	userModel "kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"

	"gorm.io/gorm"
)

func SeedCustomerAccount(db *gorm.DB) *userModel.User {
	var customerUser userModel.User
	if err := db.Where("email = ?", "user@kucek.id").First(&customerUser).Error; err != nil {
		customerUser = userModel.User{
			Name:     "Budi Santoso",
			Email:    "user@kucek.id",
			Phone:    "081298765432",
			Role:     userModel.RolePelanggan,
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

	// Pastikan profil Customer tertaut ke user@kucek.id
	var existingCust profile.Customer
	if err := db.Where("phone = ?", "081298765432").First(&existingCust).Error; err == nil {
		if existingCust.UserID == nil && customerUser.ID != 0 {
			existingCust.UserID = &customerUser.ID
			db.Save(&existingCust)
		}
	}

	return &customerUser
}
