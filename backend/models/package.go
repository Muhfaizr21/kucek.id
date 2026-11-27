package models

import (
	"time"

	"gorm.io/gorm"
)

type LaundryPackage struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Code         string         `gorm:"type:varchar(50);uniqueIndex;not null" json:"code"`
	Name         string         `gorm:"type:varchar(100);not null" json:"name"`
	Description  string         `gorm:"type:text" json:"description"`
	Price        float64        `gorm:"type:decimal(12,2);not null" json:"price"`
	QuotaKg      float64        `gorm:"type:decimal(10,2);not null" json:"quota_kg"`
	ValidityDays int            `gorm:"not null" json:"validity_days"`
	Features     string         `gorm:"type:text" json:"features"` // comma-separated or JSON
	IsPopular    bool           `gorm:"default:false" json:"is_popular"`
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
