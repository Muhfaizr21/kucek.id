package profile

import (
	"time"

	"kucek-backend/models/auth/account"
	"kucek-backend/models/superadmin/package_catalog"

	"gorm.io/gorm"
)

type Customer struct {
	ID              uint                            `gorm:"primaryKey" json:"id"`
	UserID          *uint                           `gorm:"index" json:"user_id,omitempty"`
	User            *account.User                   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Name            string                          `gorm:"type:varchar(100);not null" json:"name"`
	Phone           string                          `gorm:"type:varchar(30);index;not null" json:"phone"`
	Address         string                          `gorm:"type:text" json:"address"`
	Area            string                          `gorm:"type:varchar(100)" json:"area"`
	TotalOrders     int                             `gorm:"default:0" json:"total_orders"`
	PackageID       *uint                           `gorm:"index" json:"package_id,omitempty"`
	Package         *package_catalog.LaundryPackage `gorm:"foreignKey:PackageID" json:"package,omitempty"`
	RemainingQuota  float64                         `gorm:"type:decimal(10,2);default:0" json:"remaining_quota_kg"`
	PackageExpiryAt *time.Time                      `json:"package_expiry_at,omitempty"`
	CreatedAt       time.Time                       `json:"created_at"`
	UpdatedAt       time.Time                       `json:"updated_at"`
	DeletedAt       gorm.DeletedAt                  `gorm:"index" json:"-"`
}
