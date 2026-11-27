package controllers

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
)

type StatsController struct{}

func NewStatsController() *StatsController {
	return &StatsController{}
}

func (s *StatsController) GetDashboardStats(c *gin.Context) {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	// 1. Total order hari ini
	var todayOrders int64
	config.DB.Model(&models.Order{}).Where("created_at >= ?", todayStart).Count(&todayOrders)

	// 2. Pendapatan hari ini (paid)
	var todayRevenue float64
	config.DB.Model(&models.Order{}).Where("created_at >= ? AND payment_status = ?", todayStart, models.PaymentPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&todayRevenue)

	// 3. Cucian dalam proses (aktif)
	var activeOrders int64
	config.DB.Model(&models.Order{}).Where("status != ?", models.StatusSelesai).Count(&activeOrders)

	// 4. Total pelanggan
	var totalCustomers int64
	config.DB.Model(&models.Customer{}).Count(&totalCustomers)

	// 5. Antrean per status produksi
	type StatusCount struct {
		Status string `json:"status"`
		Count  int    `json:"count"`
	}
	var statusCounts []StatusCount
	config.DB.Model(&models.Order{}).Select("status, count(*) as count").Group("status").Scan(&statusCounts)

	views.Success(c, http.StatusOK, "Statistik dashboard berhasil dimuat", gin.H{
		"today_orders":    todayOrders,
		"today_revenue":   todayRevenue,
		"active_orders":   activeOrders,
		"total_customers": totalCustomers,
		"status_breakdown": statusCounts,
		"timestamp":       now.Format(time.RFC3339),
	})
}
