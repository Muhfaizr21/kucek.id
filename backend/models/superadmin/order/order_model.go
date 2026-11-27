package order

import (
	"time"

	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"

	"gorm.io/gorm"
)

type OrderStatus string

const (
	StatusMenungguJemput OrderStatus = "menunggu_jemput"
	StatusDiambilKurir   OrderStatus = "diambil_kurir"
	StatusTerima         OrderStatus = "terima"
	StatusCuci           OrderStatus = "cuci"
	StatusKering         OrderStatus = "kering"
	StatusSetrika        OrderStatus = "setrika"
	StatusPacking        OrderStatus = "packing"
	StatusDiantarKurir   OrderStatus = "diantar_kurir"
	StatusSelesai        OrderStatus = "selesai"
)

type PaymentStatus string

const (
	PaymentUnpaid PaymentStatus = "unpaid"
	PaymentPaid   PaymentStatus = "paid"
)

type Order struct {
	ID            uint                   `gorm:"primaryKey" json:"id"`
	OrderNumber   string                 `gorm:"type:varchar(50);uniqueIndex;not null" json:"order_number"`
	CustomerID    uint                   `gorm:"index;not null" json:"customer_id"`
	Customer      profile.Customer       `gorm:"foreignKey:CustomerID" json:"customer"`
	ServiceType   string                 `gorm:"type:varchar(30);default:'kiloan'" json:"service_type"`
	WeightKg      float64                `gorm:"type:decimal(10,2);default:0" json:"weight_kg"`
	Fragrance     string                 `gorm:"type:varchar(50);default:'ocean_fresh'" json:"fragrance"`
	PricePerKg    float64                `gorm:"type:decimal(12,2);default:8000" json:"price_per_kg"`
	Subtotal      float64                `gorm:"type:decimal(12,2);not null" json:"subtotal"`
	Discount      float64                `gorm:"type:decimal(12,2);default:0" json:"discount"`
	VoucherCode   string                 `gorm:"type:varchar(40)" json:"voucher_code,omitempty"`
	QuotaUsedKg   float64                `gorm:"type:decimal(10,2);default:0" json:"quota_used_kg"`
	DeliveryFee   float64                `gorm:"type:decimal(12,2);default:0" json:"delivery_fee"`
	TotalAmount   float64                `gorm:"type:decimal(12,2);not null" json:"total_amount"`
	Status        OrderStatus            `gorm:"type:varchar(30);default:'terima';index" json:"status"`
	PaymentStatus PaymentStatus          `gorm:"type:varchar(30);default:'unpaid';index" json:"payment_status"`
	PaymentMethod string                 `gorm:"type:varchar(30);default:'cash'" json:"payment_method"`
	Notes         string                 `gorm:"type:text" json:"notes"`
	PickupTime    *time.Time             `json:"pickup_time,omitempty"`
	DeliveryTime  *time.Time             `json:"delivery_time,omitempty"`
	CreatedByID   *uint                  `gorm:"index" json:"created_by_id,omitempty"`
	Items         []OrderItem            `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"items,omitempty"`
	Tracking      []tracking.TrackingLog `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"tracking,omitempty"`
	CreatedAt     time.Time              `json:"created_at"`
	UpdatedAt     time.Time              `json:"updated_at"`
	DeletedAt     gorm.DeletedAt         `gorm:"index" json:"-"`
}

type OrderItem struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	OrderID    uint      `gorm:"index;not null" json:"order_id"`
	ItemName   string    `gorm:"type:varchar(100);not null" json:"item_name"`
	Quantity   int       `gorm:"not null;default:1" json:"quantity"`
	UnitPrice  float64   `gorm:"type:decimal(12,2);not null" json:"unit_price"`
	TotalPrice float64   `gorm:"type:decimal(12,2);not null" json:"total_price"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
