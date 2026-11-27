package tracking

import (
	"time"
)

type TrackingLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	OrderID     uint      `gorm:"index;not null" json:"order_id"`
	OrderNumber string    `gorm:"type:varchar(50);index;not null" json:"order_number"`
	Status      string    `gorm:"type:varchar(30);not null" json:"status"`
	Title       string    `gorm:"type:varchar(100);not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Location    string    `gorm:"type:varchar(100)" json:"location"`
	UpdatedBy   string    `gorm:"type:varchar(100)" json:"updated_by"`
	Timestamp   time.Time `json:"timestamp"`
}
