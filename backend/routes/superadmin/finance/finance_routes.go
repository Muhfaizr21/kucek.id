package finance

import (
	finCtrl "kucek-backend/controllers/superadmin/finance"

	"github.com/gin-gonic/gin"
)

func RegisterFinanceRoutes(rg *gin.RouterGroup) {
	ctrl := finCtrl.NewFinanceController()
	rg.GET("/finance/summary", ctrl.GetSummary)
}
