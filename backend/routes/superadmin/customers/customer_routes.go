package customers

import (
	custCtrl "kucek-backend/controllers/superadmin/customers"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerRoutes(rg *gin.RouterGroup) {
	ctrl := custCtrl.NewCustomerController()
	rg.GET("/customers", ctrl.List)
	rg.GET("/customers/:id", ctrl.GetByID)
}
