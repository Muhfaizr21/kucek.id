package schema

import (
	"log"

	"kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/pelanggan/voucher"
	"kucek-backend/models/public/tracking"
	financeModel "kucek-backend/models/superadmin/finance"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/models/superadmin/service_catalog"

	"gorm.io/gorm"
)

func RunAutoMigrate(db *gorm.DB) error {
	log.Println("Running database auto-migrations for kucek.id...")
	return db.AutoMigrate(
		&account.User{},
		&package_catalog.LaundryPackage{},
		&service_catalog.ServiceItem{},
		&financeModel.Expense{},
		&financeModel.PackagePurchase{},
		&profile.Customer{},
		&voucher.Voucher{},
		&voucher.CustomerVoucher{},
		&order.Order{},
		&order.OrderItem{},
		&tracking.TrackingLog{},
	)
}
