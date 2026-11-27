package customers

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type CustomerController struct{}

func NewCustomerController() *CustomerController {
	return &CustomerController{}
}

type SaveCustomerRequest struct {
	Name             string  `json:"name" binding:"required"`
	Phone            string  `json:"phone" binding:"required"`
	Address          string  `json:"address"`
	Area             string  `json:"area"`
	DefaultFragrance string  `json:"default_fragrance"`
	PackageID        *uint   `json:"package_id"`
	RemainingQuota   float64 `json:"remaining_quota"`
	LoyaltyPoints    int     `json:"loyalty_points"`
}

type TopUpQuotaRequest struct {
	AddQuotaKg    float64 `json:"add_quota_kg"`
	AddPoints     int     `json:"add_points"`
	PackageID     *uint   `json:"package_id"`
	ExtendDays    int     `json:"extend_days"`
}

func (cc *CustomerController) List(c *gin.Context) {
	var customers []profile.Customer
	if err := config.DB.Preload("Package").Order("created_at DESC").Find(&customers).Error; err != nil {
		response.InternalError(c, "Gagal mengambil data pelanggan", err)
		return
	}
	response.Success(c, http.StatusOK, "Daftar pelanggan berhasil dimuat", customers)
}

func (cc *CustomerController) GetByID(c *gin.Context) {
	id := c.Param("id")
	var customer profile.Customer
	if err := config.DB.Preload("Package").First(&customer, id).Error; err != nil {
		response.NotFound(c, "Pelanggan tidak ditemukan")
		return
	}

	var orders []order.Order
	config.DB.Preload("Items").Where("customer_id = ?", customer.ID).Order("created_at DESC").Limit(15).Find(&orders)

	response.Success(c, http.StatusOK, "Data pelanggan berhasil dimuat", gin.H{
		"customer": customer,
		"orders":   orders,
	})
}

func (cc *CustomerController) Create(c *gin.Context) {
	var req SaveCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data pelanggan tidak lengkap", err)
		return
	}

	fragrance := req.DefaultFragrance
	if fragrance == "" {
		fragrance = "ocean_fresh"
	}

	var expiryPtr *time.Time
	if req.PackageID != nil {
		var pkg package_catalog.LaundryPackage
		if err := config.DB.First(&pkg, *req.PackageID).Error; err == nil {
			exp := time.Now().AddDate(0, 0, pkg.ValidityDays)
			expiryPtr = &exp
			if req.RemainingQuota <= 0 {
				req.RemainingQuota = pkg.QuotaKg
			}
		}
	}

	customer := profile.Customer{
		Name:             req.Name,
		Phone:            req.Phone,
		Address:          req.Address,
		Area:             req.Area,
		DefaultFragrance: fragrance,
		PackageID:        req.PackageID,
		RemainingQuota:   req.RemainingQuota,
		LoyaltyPoints:    req.LoyaltyPoints,
		PackageExpiryAt:  expiryPtr,
	}

	if err := config.DB.Create(&customer).Error; err != nil {
		response.InternalError(c, "Gagal menyimpan pelanggan baru", err)
		return
	}

	config.DB.Preload("Package").First(&customer, customer.ID)
	response.Success(c, http.StatusCreated, "Pelanggan baru berhasil ditambahkan", customer)
}

func (cc *CustomerController) Update(c *gin.Context) {
	id := c.Param("id")
	var customer profile.Customer
	if err := config.DB.First(&customer, id).Error; err != nil {
		response.NotFound(c, "Pelanggan tidak ditemukan")
		return
	}

	var req SaveCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data perubahan pelanggan tidak valid", err)
		return
	}

	customer.Name = req.Name
	customer.Phone = req.Phone
	customer.Address = req.Address
	customer.Area = req.Area
	if req.DefaultFragrance != "" {
		customer.DefaultFragrance = req.DefaultFragrance
	}
	customer.PackageID = req.PackageID
	customer.RemainingQuota = req.RemainingQuota
	customer.LoyaltyPoints = req.LoyaltyPoints

	if err := config.DB.Save(&customer).Error; err != nil {
		response.InternalError(c, "Gagal memperbarui data pelanggan", err)
		return
	}

	config.DB.Preload("Package").First(&customer, customer.ID)
	response.Success(c, http.StatusOK, "Data pelanggan berhasil diperbarui", customer)
}

func (cc *CustomerController) TopUpQuota(c *gin.Context) {
	id := c.Param("id")
	var customer profile.Customer
	if err := config.DB.First(&customer, id).Error; err != nil {
		response.NotFound(c, "Pelanggan tidak ditemukan")
		return
	}

	var req TopUpQuotaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data top-up kuota tidak valid", err)
		return
	}

	customer.RemainingQuota += req.AddQuotaKg
	if customer.RemainingQuota < 0 {
		customer.RemainingQuota = 0
	}
	customer.LoyaltyPoints += req.AddPoints
	if customer.LoyaltyPoints < 0 {
		customer.LoyaltyPoints = 0
	}

	if req.PackageID != nil {
		customer.PackageID = req.PackageID
	}

	days := req.ExtendDays
	if days <= 0 && req.AddQuotaKg > 0 {
		days = 30
	}
	if days > 0 {
		base := time.Now()
		if customer.PackageExpiryAt != nil && customer.PackageExpiryAt.After(base) {
			base = *customer.PackageExpiryAt
		}
		exp := base.AddDate(0, 0, days)
		customer.PackageExpiryAt = &exp
	}

	if err := config.DB.Save(&customer).Error; err != nil {
		response.InternalError(c, "Gagal memproses top-up kuota pelanggan", err)
		return
	}

	config.DB.Preload("Package").First(&customer, customer.ID)
	response.Success(c, http.StatusOK, "Top-up kuota & poin pelanggan berhasil disimpan", customer)
}

func (cc *CustomerController) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&profile.Customer{}, id).Error; err != nil {
		response.InternalError(c, "Gagal menghapus pelanggan", err)
		return
	}
	response.Success(c, http.StatusOK, "Pelanggan berhasil dihapus", gin.H{"deleted_id": id})
}
