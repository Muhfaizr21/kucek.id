package controllers

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
)

type PackageController struct{}

func NewPackageController() *PackageController {
	return &PackageController{}
}

func (p *PackageController) List(c *gin.Context) {
	var packages []models.LaundryPackage
	if err := config.DB.Where("is_active = true").Order("price ASC").Find(&packages).Error; err != nil {
		views.InternalError(c, "Gagal mengambil daftar paket", err)
		return
	}
	views.Success(c, http.StatusOK, "Daftar paket berhasil dimuat", packages)
}

func (p *PackageController) Buy(c *gin.Context) {
	type BuyReq struct {
		PackageID uint `json:"package_id" binding:"required"`
	}
	var req BuyReq
	if err := c.ShouldBindJSON(&req); err != nil {
		views.BadRequest(c, "Paket yang dipilih tidak valid", err)
		return
	}

	userID, _ := c.Get("userID")

	var pkg models.LaundryPackage
	if err := config.DB.First(&pkg, req.PackageID).Error; err != nil {
		views.NotFound(c, "Paket langganan tidak ditemukan")
		return
	}

	var customer models.Customer
	if err := config.DB.Where("user_id = ?", userID).First(&customer).Error; err != nil {
		views.NotFound(c, "Profil pelanggan tidak ditemukan")
		return
	}

	expiry := time.Now().AddDate(0, 0, pkg.ValidityDays)
	customer.PackageID = &pkg.ID
	customer.RemainingQuota += pkg.QuotaKg
	customer.PackageExpiryAt = &expiry

	if err := config.DB.Save(&customer).Error; err != nil {
		views.InternalError(c, "Gagal memproses pembelian paket", err)
		return
	}

	views.Success(c, http.StatusOK, "Paket langganan berhasil diaktifkan", gin.H{
		"package":            pkg.Name,
		"remaining_quota_kg": customer.RemainingQuota,
		"expiry_at":          customer.PackageExpiryAt,
	})
}
