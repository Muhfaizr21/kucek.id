package history

import (
	histCtrl "kucek-backend/controllers/pelanggan/history"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerHistoryRoutes(rg *gin.RouterGroup) {
	ctrl := histCtrl.NewOrderHistoryController()
	rg.GET("/customer/my-orders", ctrl.ListMyOrders)
}
