package service_catalog

import (
	"time"

	"gorm.io/gorm"
)

type ServiceItem struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Code           string         `gorm:"type:varchar(50);uniqueIndex;not null" json:"code"`
	Name           string         `gorm:"type:varchar(100);not null" json:"name"`
	Category       string         `gorm:"type:varchar(50);not null;index" json:"category"` // "SATUAN", "KILOAN", "SEPATU_HELM", "RUMAH_TANGGA"
	Price          float64        `gorm:"type:decimal(12,2);not null" json:"price"`
	Unit           string         `gorm:"type:varchar(20);not null;default:'pcs'" json:"unit"` // "pcs", "kg", "m2", "pasang"
	Description    string         `gorm:"type:text" json:"description"`
	EstimatedHours int            `gorm:"default:48" json:"estimated_hours"`
	IsActive       bool           `gorm:"default:true;index" json:"is_active"`
	SortOrder      int            `gorm:"default:0" json:"sort_order"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
