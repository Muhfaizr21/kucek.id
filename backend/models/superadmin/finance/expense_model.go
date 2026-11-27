package finance

import (
	"time"

	"gorm.io/gorm"
)

type Expense struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Title         string         `gorm:"type:varchar(150);not null" json:"title"`
	Category      string         `gorm:"type:varchar(50);not null;index" json:"category"` // "BAHAN_BAKU", "UTILITAS", "GAJI_SDM", "LOGISTIK_KURIR", "PERAWATAN_MESIN", "KEMASAN"
	Amount        float64        `gorm:"type:decimal(12,2);not null" json:"amount"`
	PaymentMethod string         `gorm:"type:varchar(30);default:'Transfer Bank'" json:"payment_method"`
	ExpenseDate   time.Time      `gorm:"index" json:"expense_date"`
	PIC           string         `gorm:"type:varchar(100);default:'Superadmin'" json:"pic"`
	Notes         string         `gorm:"type:text" json:"notes"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
