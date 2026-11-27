package service_catalog

import (
	srvCtrl "kucek-backend/controllers/superadmin/service_catalog"

	"github.com/gin-gonic/gin"
)

func RegisterServiceCatalogRoutes(rg *gin.RouterGroup) {
	ctrl := srvCtrl.NewServiceCatalogController()
	rg.GET("/admin/services", ctrl.ListServices)
	rg.POST("/admin/services", ctrl.CreateService)
	rg.PUT("/admin/services/:id", ctrl.UpdateService)
	rg.DELETE("/admin/services/:id", ctrl.DeleteService)
}
