package seeds

import (
	pelangganAccountSeed "kucek-backend/database/seeds/pelanggan/account"
	pelangganOrderSeed "kucek-backend/database/seeds/pelanggan/order"
	pelangganVoucherSeed "kucek-backend/database/seeds/pelanggan/voucher"
	superadminAccountSeed "kucek-backend/database/seeds/superadmin/account"
	superadminCatalogSeed "kucek-backend/database/seeds/superadmin/catalog"
	superadminFinanceSeed "kucek-backend/database/seeds/superadmin/finance"

	"gorm.io/gorm"
)

func RunAllSeeds(db *gorm.DB) {
	superadminAccountSeed.SeedSuperadmin(db)
	customerUser := pelangganAccountSeed.SeedCustomerAccount(db)
	superadminCatalogSeed.SeedLaundryPackages(db)
	superadminCatalogSeed.SeedServiceItems(db)
	superadminAccountSeed.SeedExtraCustomers(db)
	pelangganOrderSeed.SeedSampleOrder(db, customerUser)
	pelangganVoucherSeed.SeedVouchers(db)
	superadminFinanceSeed.SeedExpenses(db)
}
