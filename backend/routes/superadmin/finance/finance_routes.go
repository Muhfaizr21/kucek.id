package finance

import (
	finCtrl "kucek-backend/controllers/superadmin/finance"

	"github.com/gin-gonic/gin"
)

func RegisterFinanceRoutes(rg *gin.RouterGroup) {
	ctrl := finCtrl.NewFinanceController()
	rg.GET("/finance/summary", ctrl.GetSummary)
	rg.GET("/finance/expenses", ctrl.ListExpenses)
	rg.POST("/finance/expenses", ctrl.CreateExpense)
	rg.DELETE("/finance/expenses/:id", ctrl.DeleteExpense)
}
