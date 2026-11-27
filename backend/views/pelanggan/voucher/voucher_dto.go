package voucher

type ClaimVoucherRequest struct {
	Code      string `json:"code"`
	VoucherID uint   `json:"voucher_id"`
}

type ValidateVoucherRequest struct {
	Code        string  `json:"code" binding:"required"`
	Category    string  `json:"category"` // kiloan, satuan, paket, all
	Subtotal    float64 `json:"subtotal"`
	WeightKg    float64 `json:"weight_kg"`
}
