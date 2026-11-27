package subscription

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/views/common/response"
	subView "kucek-backend/views/pelanggan/subscription"

	"github.com/gin-gonic/gin"
)

type BuyPackageController struct{}

func NewBuyPackageController() *BuyPackageController {
	return &BuyPackageController{}
}

func (b *BuyPackageController) Buy(c *gin.Context) {
	var req subView.BuyPackageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Paket yang dipilih tidak valid", err)
		return
	}

	userID, _ := c.Get("userID")

	var pkg package_catalog.LaundryPackage
	if err := config.DB.First(&pkg, req.PackageID).Error; err != nil {
		response.NotFound(c, "Paket langganan tidak ditemukan")
		return
	}

	var customer profile.Customer
	if err := config.DB.Where("user_id = ?", userID).First(&customer).Error; err != nil {
		response.NotFound(c, "Profil pelanggan tidak ditemukan")
		return
	}

	expiry := time.Now().AddDate(0, 0, pkg.ValidityDays)
	customer.PackageID = &pkg.ID
	customer.RemainingQuota += pkg.QuotaKg
	customer.PackageExpiryAt = &expiry

	if err := config.DB.Save(&customer).Error; err != nil {
		response.InternalError(c, "Gagal memproses pembelian paket", err)
		return
	}

	response.Success(c, http.StatusOK, "Paket langganan berhasil diaktifkan", gin.H{
		"package":            pkg.Name,
		"remaining_quota_kg": customer.RemainingQuota,
		"expiry_at":          customer.PackageExpiryAt,
	})
}
