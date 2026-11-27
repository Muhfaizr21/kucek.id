package packages

import (
	pkgCtrl "kucek-backend/controllers/superadmin/packages"

	"github.com/gin-gonic/gin"
)

func RegisterPackageManagementRoutes(rg *gin.RouterGroup) {
	ctrl := pkgCtrl.NewPackageManagementController()
	rg.GET("/admin/packages", ctrl.ListAll)
	rg.POST("/admin/packages", ctrl.Create)
	rg.PUT("/admin/packages/:id", ctrl.Update)
	rg.DELETE("/admin/packages/:id", ctrl.Delete)
}
