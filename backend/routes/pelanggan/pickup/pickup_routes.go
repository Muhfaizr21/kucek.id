package pickup

import (
	pickupCtrl "kucek-backend/controllers/pelanggan/pickup"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerPickupRoutes(rg *gin.RouterGroup) {
	ctrl := pickupCtrl.NewBookPickupController()
	rg.POST("/customer/book-pickup", ctrl.BookPickup)
}
