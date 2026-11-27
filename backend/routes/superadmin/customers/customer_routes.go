package customers

import (
	custCtrl "kucek-backend/controllers/superadmin/customers"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerRoutes(rg *gin.RouterGroup) {
	ctrl := custCtrl.NewCustomerController()
	rg.GET("/customers", ctrl.List)
	rg.GET("/customers/:id", ctrl.GetByID)
	rg.POST("/customers", ctrl.Create)
	rg.PUT("/customers/:id", ctrl.Update)
	rg.POST("/customers/:id/topup-quota", ctrl.TopUpQuota)
	rg.DELETE("/customers/:id", ctrl.Delete)
}
