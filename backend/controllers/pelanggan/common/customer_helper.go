package common

import (
	"errors"

	"kucek-backend/config"
	"kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"

	"github.com/gin-gonic/gin"
)

// ResolveCustomerFromContext mengambil profil pelanggan yang secara ketat terikat dengan userID JWT.
// Jika profil belum ada, dibuatkan profil baru yang terisolasi khusus akun tersebut.
// Tidak pernah melakukan fallback ke record user/pelanggan lain.
func ResolveCustomerFromContext(c *gin.Context, preloadPackage bool) (*profile.Customer, error) {
	val, exists := c.Get("userID")
	if !exists {
		return nil, errors.New("sesi otentikasi tidak ditemukan")
	}

	userID := val.(uint)

	var cust profile.Customer
	q := config.DB
	if preloadPackage {
		q = q.Preload("Package")
	}

	if err := q.Where("user_id = ?", userID).First(&cust).Error; err == nil {
		return &cust, nil
	}

	// Auto-buat profil baru yang terikat khusus user ini jika belum ada di tabel customers
	var user account.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return nil, errors.New("akun pengguna tidak ditemukan")
	}

	newCust := profile.Customer{
		UserID:           &user.ID,
		Name:             user.Name,
		Phone:            user.Phone,
		Address:          "Jl. Kaliurang, Sleman, DI Yogyakarta",
		Area:             "Sleman (Zona Gratis Ongkir)",
		DefaultFragrance: "ocean_fresh",
		RemainingQuota:   0,
		LoyaltyPoints:    100,
	}

	if err := config.DB.Create(&newCust).Error; err != nil {
		return nil, err
	}

	if preloadPackage {
		config.DB.Preload("Package").First(&newCust, newCust.ID)
	}

	return &newCust, nil
}
