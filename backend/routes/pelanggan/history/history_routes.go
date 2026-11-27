package history

import (
	historyCtrl "kucek-backend/controllers/pelanggan/history"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerHistoryRoutes(rg *gin.RouterGroup) {
	ctrl := historyCtrl.NewOrderHistoryController()
	customer := rg.Group("/customer")
	{
		customer.GET("/my-orders", ctrl.ListMyOrders)
		customer.POST("/orders/:id/pay", ctrl.PayOrder)
	}
}
