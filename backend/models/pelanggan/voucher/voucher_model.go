package voucher

import (
	"time"

	"kucek-backend/models/pelanggan/profile"

	"gorm.io/gorm"
)

type Voucher struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Code          string         `gorm:"type:varchar(40);uniqueIndex;not null" json:"code"`
	Title         string         `gorm:"type:varchar(150);not null" json:"title"`
	Description   string         `gorm:"type:text" json:"description"`
	Category      string         `gorm:"type:varchar(30);default:'all'" json:"category"`           // all, kiloan, satuan, paket
	DiscountType  string         `gorm:"type:varchar(30);default:'percent'" json:"discount_type"`  // percent, fixed
	DiscountValue float64        `gorm:"type:decimal(12,2);not null" json:"discount_value"`        // e.g. 20 (%) or 15000 (Rp)
	MaxDiscount   float64        `gorm:"type:decimal(12,2);default:0" json:"max_discount"`         // 0 means no cap
	MinOrderValue float64        `gorm:"type:decimal(12,2);default:0" json:"min_order_value"`
	MinWeightKg   float64        `gorm:"type:decimal(10,2);default:0" json:"min_weight_kg"`
	TotalQuota    int            `gorm:"default:100" json:"total_quota"`
	UsedCount     int            `gorm:"default:0" json:"used_count"`
	BadgeColor    string         `gorm:"type:varchar(30);default:'blue'" json:"badge_color"` // blue, emerald, amber, purple, rose
	Terms         string         `gorm:"type:text" json:"terms"`
	ValidUntil    time.Time      `json:"valid_until"`
	IsActive      bool           `gorm:"default:true" json:"is_active"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

type CustomerVoucher struct {
	ID              uint             `gorm:"primaryKey" json:"id"`
	CustomerID      uint             `gorm:"index;not null" json:"customer_id"`
	Customer        profile.Customer `gorm:"foreignKey:CustomerID" json:"-"`
	VoucherID       uint             `gorm:"index;not null" json:"voucher_id"`
	Voucher         Voucher          `gorm:"foreignKey:VoucherID" json:"voucher"`
	Status          string           `gorm:"type:varchar(20);default:'claimed';index" json:"status"` // claimed, used, expired
	ClaimedAt       time.Time        `json:"claimed_at"`
	UsedAt          *time.Time       `json:"used_at,omitempty"`
	UsedOrderNumber string           `gorm:"type:varchar(50)" json:"used_order_number,omitempty"`
	SavedAmount     float64          `gorm:"type:decimal(12,2);default:0" json:"saved_amount"`
	CreatedAt       time.Time        `json:"created_at"`
	UpdatedAt       time.Time        `json:"updated_at"`
}
