package account

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Role string

const (
	RoleSuperAdmin Role = "superadmin"
	RolePelanggan  Role = "pelanggan"
	RoleKasir      Role = "kasir"
	RoleOperator   Role = "operator"
	RoleKurir      Role = "kurir"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"type:varchar(100);not null" json:"name"`
	Email     string         `gorm:"type:varchar(150);uniqueIndex;not null" json:"email"`
	Phone     string         `gorm:"type:varchar(30);index" json:"phone"`
	Password  string         `gorm:"type:varchar(255);not null" json:"-"`
	Role      Role           `gorm:"type:varchar(30);default:'pelanggan';not null" json:"role"`
	SubRole   string         `gorm:"type:varchar(30);default:''" json:"sub_role"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *User) SetPassword(rawPassword string) error {
	hashed, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashed)
	return nil
}

func (u *User) CheckPassword(rawPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(rawPassword))
	return err == nil
}
