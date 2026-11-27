package dashboard

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type StatsController struct{}

func NewStatsController() *StatsController {
	return &StatsController{}
}

func (s *StatsController) GetDashboardStats(c *gin.Context) {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	var todayOrders int64
	config.DB.Model(&order.Order{}).Where("created_at >= ?", todayStart).Count(&todayOrders)

	var todayRevenue float64
	config.DB.Model(&order.Order{}).Where("created_at >= ? AND payment_status = ?", todayStart, order.PaymentPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&todayRevenue)

	var activeOrders int64
	config.DB.Model(&order.Order{}).Where("status != ?", order.StatusSelesai).Count(&activeOrders)

	var totalCustomers int64
	config.DB.Model(&profile.Customer{}).Count(&totalCustomers)

	type StatusCount struct {
		Status string `json:"status"`
		Count  int    `json:"count"`
	}
	var statusCounts []StatusCount
	config.DB.Model(&order.Order{}).Select("status, count(*) as count").Group("status").Scan(&statusCounts)

	response.Success(c, http.StatusOK, "Statistik dashboard berhasil dimuat", gin.H{
		"today_orders":     todayOrders,
		"today_revenue":    todayRevenue,
		"active_orders":    activeOrders,
		"total_customers":  totalCustomers,
		"status_breakdown": statusCounts,
		"timestamp":        now.Format(time.RFC3339),
	})
}
