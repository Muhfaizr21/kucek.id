package views

type CreateOrderRequest struct {
	CustomerName  string            `json:"customer_name" binding:"required"`
	CustomerPhone string            `json:"customer_phone" binding:"required"`
	CustomerArea  string            `json:"customer_area"`
	Address       string            `json:"address"`
	ServiceType   string            `json:"service_type" binding:"required"` // kiloan / satuan
	WeightKg      float64           `json:"weight_kg"`
	Fragrance     string            `json:"fragrance"`
	PricePerKg    float64           `json:"price_per_kg"`
	Discount      float64           `json:"discount"`
	DeliveryFee   float64           `json:"delivery_fee"`
	PaymentMethod string            `json:"payment_method"` // cash, qris, transfer
	PaymentStatus string            `json:"payment_status"` // unpaid, paid
	Notes         string            `json:"notes"`
	Items         []CreateOrderItem `json:"items"`
}

type CreateOrderItem struct {
	ItemName  string  `json:"item_name" binding:"required"`
	Quantity  int     `json:"quantity" binding:"required,min=1"`
	UnitPrice float64 `json:"unit_price" binding:"required"`
}

type UpdateStatusRequest struct {
	Status      string `json:"status" binding:"required"`
	Description string `json:"description"`
	Location    string `json:"location"`
}

type BookPickupRequest struct {
	PickupDate string `json:"pickup_date" binding:"required"`
	TimeSlot   string `json:"time_slot" binding:"required"`
	Address    string `json:"address" binding:"required"`
	Notes      string `json:"notes"`
	Fragrance  string `json:"fragrance"`
}
