package pickup

type BookPickupRequest struct {
	PickupDate  string  `json:"pickup_date" binding:"required"`
	TimeSlot    string  `json:"time_slot" binding:"required"`
	Address     string  `json:"address" binding:"required"`
	Area        string  `json:"area"`
	ServiceType string  `json:"service_type"`
	WeightKg    float64 `json:"weight_kg"`
	Fragrance   string  `json:"fragrance"`
	Notes       string  `json:"notes"`
	VoucherCode string  `json:"voucher_code"`
	UseQuota    bool    `json:"use_quota"`
}
