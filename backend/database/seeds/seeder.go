package seeds

import (
	pelangganAccountSeed "kucek-backend/database/seeds/pelanggan/account"
	pelangganOrderSeed "kucek-backend/database/seeds/pelanggan/order"
	pelangganVoucherSeed "kucek-backend/database/seeds/pelanggan/voucher"
	superadminAccountSeed "kucek-backend/database/seeds/superadmin/account"
	superadminCatalogSeed "kucek-backend/database/seeds/superadmin/catalog"

	"gorm.io/gorm"
)

func RunAllSeeds(db *gorm.DB) {
	superadminAccountSeed.SeedSuperadmin(db)
	customerUser := pelangganAccountSeed.SeedCustomerAccount(db)
	superadminCatalogSeed.SeedLaundryPackages(db)
	pelangganOrderSeed.SeedSampleOrder(db, customerUser)
	pelangganVoucherSeed.SeedVouchers(db)
}
