package pos

type CreateOrderRequest struct {
	CustomerName  string            `json:"customer_name" binding:"required"`
	CustomerPhone string            `json:"customer_phone" binding:"required"`
	CustomerArea  string            `json:"customer_area"`
	Address       string            `json:"address"`
	ServiceType   string            `json:"service_type" binding:"required"`
	WeightKg      float64           `json:"weight_kg"`
	Fragrance     string            `json:"fragrance"`
	PricePerKg    float64           `json:"price_per_kg"`
	Discount      float64           `json:"discount"`
	DeliveryFee   float64           `json:"delivery_fee"`
	PaymentMethod string            `json:"payment_method"`
	PaymentStatus string            `json:"payment_status"`
	Notes         string            `json:"notes"`
	Items         []CreateOrderItem `json:"items"`
}

type CreateOrderItem struct {
	ItemName  string  `json:"item_name" binding:"required"`
	Quantity  int     `json:"quantity" binding:"required,min=1"`
	UnitPrice float64 `json:"unit_price" binding:"required"`
}

type UpdatePaymentRequest struct {
	PaymentStatus string `json:"payment_status" binding:"required"`
	PaymentMethod string `json:"payment_method"`
}
