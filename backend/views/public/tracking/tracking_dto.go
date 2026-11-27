package tracking

import "time"

type TrackingDetailResponse struct {
	OrderNumber   string      `json:"order_number"`
	CustomerName  string      `json:"customer_name"`
	CustomerPhone string      `json:"customer_phone"`
	ServiceType   string      `json:"service_type"`
	WeightKg      float64     `json:"weight_kg"`
	Fragrance     string      `json:"fragrance"`
	TotalAmount   float64     `json:"total_amount"`
	Status        string      `json:"status"`
	PaymentStatus string      `json:"payment_status"`
	Items         interface{} `json:"items"`
	Timeline      interface{} `json:"timeline"`
	CreatedAt     time.Time   `json:"created_at"`
}
