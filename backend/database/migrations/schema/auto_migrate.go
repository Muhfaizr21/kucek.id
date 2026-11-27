package schema

import (
	"log"

	"kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/models/superadmin/package_catalog"

	"gorm.io/gorm"
)

func RunAutoMigrate(db *gorm.DB) error {
	log.Println("Running database auto-migrations for kucek.id...")
	return db.AutoMigrate(
		&account.User{},
		&package_catalog.LaundryPackage{},
		&profile.Customer{},
		&order.Order{},
		&order.OrderItem{},
		&tracking.TrackingLog{},
	)
}
