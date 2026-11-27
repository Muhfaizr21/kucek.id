package pos

import (
	posCtrl "kucek-backend/controllers/superadmin/pos"

	"github.com/gin-gonic/gin"
)

func RegisterPosRoutes(rg *gin.RouterGroup) {
	ctrl := posCtrl.NewPosOrderController()
	rg.GET("/orders", ctrl.ListOrders)
	rg.POST("/orders", ctrl.CreateOrder)
	rg.GET("/orders/:id", ctrl.GetOrderByID)
	rg.PATCH("/orders/:id/payment", ctrl.UpdatePayment)
}
