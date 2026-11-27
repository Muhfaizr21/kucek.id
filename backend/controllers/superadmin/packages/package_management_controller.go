package packages

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/views/common/response"
	packageView "kucek-backend/views/superadmin/packages"

	"github.com/gin-gonic/gin"
)

type PackageManagementController struct{}

func NewPackageManagementController() *PackageManagementController {
	return &PackageManagementController{}
}

func (p *PackageManagementController) ListAll(c *gin.Context) {
	var packages []package_catalog.LaundryPackage
	if err := config.DB.Order("price ASC").Find(&packages).Error; err != nil {
		response.InternalError(c, "Gagal memuat katalog paket", err)
		return
	}
	response.Success(c, http.StatusOK, "Seluruh paket langganan berhasil dimuat", packages)
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
