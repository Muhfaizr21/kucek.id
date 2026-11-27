package subscription

type BuyPackageRequest struct {
	PackageID     uint   `json:"package_id" binding:"required"`
	PaymentMethod string `json:"payment_method"`
	VoucherCode   string `json:"voucher_code"`
}
