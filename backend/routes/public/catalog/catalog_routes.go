package catalog

import (
	catalogCtrl "kucek-backend/controllers/public/catalog"

	"github.com/gin-gonic/gin"
)

func RegisterCatalogRoutes(rg *gin.RouterGroup) {
	ctrl := catalogCtrl.NewPackageCatalogController()
	rg.GET("/packages", ctrl.ListPublicPackages)
}
