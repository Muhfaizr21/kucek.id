package dashboard

import (
	dashboardCtrl "kucek-backend/controllers/superadmin/dashboard"

	"github.com/gin-gonic/gin"
)

func RegisterDashboardRoutes(rg *gin.RouterGroup) {
	ctrl := dashboardCtrl.NewStatsController()
	rg.GET("/stats/dashboard", ctrl.GetDashboardStats)
}
