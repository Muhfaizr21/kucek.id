package dashboard

import (
	hubCtrl "kucek-backend/controllers/pelanggan/dashboard"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerHubRoutes(rg *gin.RouterGroup) {
	ctrl := hubCtrl.NewCustomerHubController()
	rg.GET("/customer/hub", ctrl.GetHubOverview)
}
