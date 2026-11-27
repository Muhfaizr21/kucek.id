package packages

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/views/common/response"
	packageView "kucek-backend/views/superadmin/packages"

	"github.com/gin-gonic/gin"
)

type PackageManagementController struct{}

func NewPackageManagementController() *PackageManagementController {
	return &PackageManagementController{}
}

type PackageWithSubscribers struct {
	package_catalog.LaundryPackage
	SubscriberCount int64 `json:"subscriber_count"`
}

func (p *PackageManagementController) ListAll(c *gin.Context) {
	var packages []package_catalog.LaundryPackage
	if err := config.DB.Order("price ASC").Find(&packages).Error; err != nil {
		response.InternalError(c, "Gagal memuat katalog paket", err)
		return
	}

	var result []PackageWithSubscribers
	for _, pkg := range packages {
		var subCount int64
		config.DB.Model(&profile.Customer{}).Where("package_id = ?", pkg.ID).Count(&subCount)
		result = append(result, PackageWithSubscribers{
			LaundryPackage:  pkg,
			SubscriberCount: subCount,
		})
	}

	response.Success(c, http.StatusOK, "Seluruh paket langganan berhasil dimuat", result)
}

func (p *PackageManagementController) Create(c *gin.Context) {
	var req packageView.SavePackageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data paket tidak lengkap", err)
		return
	}

	pkg := package_catalog.LaundryPackage{
		Code:         req.Code,
		Name:         req.Name,
		Description:  req.Description,
		Price:        req.Price,
		QuotaKg:      req.QuotaKg,
		ValidityDays: req.ValidityDays,
		Features:     req.Features,
		IsPopular:    req.IsPopular,
		IsActive:     true,
	}

	if err := config.DB.Create(&pkg).Error; err != nil {
		response.InternalError(c, "Gagal menyimpan paket baru", err)
		return
	}
	response.Success(c, http.StatusCreated, "Paket langganan berhasil ditambahkan", pkg)
}

func (p *PackageManagementController) Update(c *gin.Context) {
	id := c.Param("id")
	var pkg package_catalog.LaundryPackage
	if err := config.DB.First(&pkg, id).Error; err != nil {
		response.NotFound(c, "Paket langganan tidak ditemukan")
		return
	}

	var req struct {
		Code         string  `json:"code"`
		Name         string  `json:"name" binding:"required"`
		Description  string  `json:"description"`
		Price        float64 `json:"price" binding:"required"`
		QuotaKg      float64 `json:"quota_kg" binding:"required"`
		ValidityDays int     `json:"validity_days" binding:"required"`
		Features     string  `json:"features"`
		IsPopular    bool    `json:"is_popular"`
		IsActive     *bool   `json:"is_active"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data perubahan paket tidak valid", err)
		return
	}

	if req.Code != "" {
		pkg.Code = req.Code
	}
	pkg.Name = req.Name
	pkg.Description = req.Description
	pkg.Price = req.Price
	pkg.QuotaKg = req.QuotaKg
	pkg.ValidityDays = req.ValidityDays
	pkg.Features = req.Features
	pkg.IsPopular = req.IsPopular
	if req.IsActive != nil {
		pkg.IsActive = *req.IsActive
	}

	if err := config.DB.Save(&pkg).Error; err != nil {
		response.InternalError(c, "Gagal memperbarui paket langganan", err)
		return
	}

	response.Success(c, http.StatusOK, "Paket langganan berhasil diperbarui", pkg)
}

func (p *PackageManagementController) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&package_catalog.LaundryPackage{}, id).Error; err != nil {
		response.InternalError(c, "Gagal menghapus paket langganan", err)
		return
	}
	response.Success(c, http.StatusOK, "Paket langganan berhasil dihapus", gin.H{"deleted_id": id})
}
