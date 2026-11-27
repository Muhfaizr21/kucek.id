package catalog

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type PackageCatalogController struct{}

func NewPackageCatalogController() *PackageCatalogController {
	return &PackageCatalogController{}
}

func (p *PackageCatalogController) ListPublicPackages(c *gin.Context) {
	var packages []package_catalog.LaundryPackage
	if err := config.DB.Where("is_active = true").Order("price ASC").Find(&packages).Error; err != nil {
		response.InternalError(c, "Gagal mengambil daftar paket", err)
		return
	}
	response.Success(c, http.StatusOK, "Daftar paket berhasil dimuat", packages)
}
