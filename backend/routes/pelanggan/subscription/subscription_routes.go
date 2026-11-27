package subscription

import (
	subCtrl "kucek-backend/controllers/pelanggan/subscription"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerSubscriptionRoutes(rg *gin.RouterGroup) {
	ctrl := subCtrl.NewBuyPackageController()
	rg.POST("/customer/buy-package", ctrl.Buy)
}
