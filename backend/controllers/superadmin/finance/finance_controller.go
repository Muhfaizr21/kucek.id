package finance

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type FinanceController struct{}

func NewFinanceController() *FinanceController {
	return &FinanceController{}
}

func (f *FinanceController) GetSummary(c *gin.Context) {
	var totalPaidRevenue float64
	config.DB.Model(&order.Order{}).Where("payment_status = ?", order.PaymentPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalPaidRevenue)

	var totalUnpaidAmount float64
	config.DB.Model(&order.Order{}).Where("payment_status = ?", order.PaymentUnpaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalUnpaidAmount)

	var totalTransactions int64
	config.DB.Model(&order.Order{}).Count(&totalTransactions)

	response.Success(c, http.StatusOK, "Ringkasan laporan keuangan berhasil dimuat", gin.H{
		"total_paid_revenue":  totalPaidRevenue,
		"total_unpaid_amount": totalUnpaidAmount,
		"total_transactions":  totalTransactions,
	})
}
