package catalog

import (
	catalogCtrl "kucek-backend/controllers/public/catalog"
	srvCtrl "kucek-backend/controllers/superadmin/service_catalog"

	"github.com/gin-gonic/gin"
)

func RegisterCatalogRoutes(rg *gin.RouterGroup) {
	ctrl := catalogCtrl.NewPackageCatalogController()
	sCtrl := srvCtrl.NewServiceCatalogController()
	rg.GET("/packages", ctrl.ListPublicPackages)
	rg.GET("/services", sCtrl.ListServices)
}
