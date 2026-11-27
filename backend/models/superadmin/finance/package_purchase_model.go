package finance

import (
	"time"

	"gorm.io/gorm"
)

type PackagePurchase struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	InvoiceNumber  string         `gorm:"type:varchar(50);uniqueIndex;not null" json:"invoice_number"`
	CustomerID     uint           `gorm:"index;not null" json:"customer_id"`
	PackageID      uint           `gorm:"index;not null" json:"package_id"`
	PackageName    string         `gorm:"type:varchar(100)" json:"package_name"`
	QuotaKg        float64        `gorm:"type:decimal(10,2);not null" json:"quota_kg"`
	Price          float64        `gorm:"type:decimal(12,2);not null" json:"price"`
	DiscountAmount float64        `gorm:"type:decimal(12,2);default:0" json:"discount_amount"`
	FinalPaid      float64        `gorm:"type:decimal(12,2);not null" json:"final_paid"`
	VoucherCode    string         `gorm:"type:varchar(40)" json:"voucher_code,omitempty"`
	PaymentMethod  string         `gorm:"type:varchar(30);default:'qris'" json:"payment_method"`
	PurchaseDate   time.Time      `gorm:"index" json:"purchase_date"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
