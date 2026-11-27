package dashboard

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	financeModel "kucek-backend/models/superadmin/finance"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/models/superadmin/service_catalog"
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

	var totalOrders int64
	config.DB.Model(&order.Order{}).Count(&totalOrders)

	var todayRevenue float64
	config.DB.Model(&order.Order{}).Where("created_at >= ? AND payment_status = ?", todayStart, order.PaymentPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&todayRevenue)

	var totalOrderRevenue float64
	config.DB.Model(&order.Order{}).Where("payment_status = ?", order.PaymentPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalOrderRevenue)

	var customersWithPkg []profile.Customer
	config.DB.Preload("Package").Where("package_id IS NOT NULL").Find(&customersWithPkg)
	var packageRevenue float64
	for _, cust := range customersWithPkg {
		if cust.Package != nil {
			packageRevenue += cust.Package.Price
		}
	}

	var totalWeightKg float64
	config.DB.Model(&order.Order{}).Select("COALESCE(SUM(weight_kg), 0)").Scan(&totalWeightKg)

	var activeOrders int64
	config.DB.Model(&order.Order{}).Where("status != ?", order.StatusSelesai).Count(&activeOrders)

	var expressActiveCount int64
	config.DB.Model(&order.Order{}).Where("status != ? AND service_type = ?", order.StatusSelesai, "express").Count(&expressActiveCount)

	var totalCustomers int64
	config.DB.Model(&profile.Customer{}).Count(&totalCustomers)

	var memberCustomers int64
	config.DB.Model(&profile.Customer{}).Where("remaining_quota > 0").Count(&memberCustomers)

	var totalStaff int64
	config.DB.Model(&account.User{}).Where("role IN ?", []string{"superadmin", "kasir", "operator", "kurir"}).Count(&totalStaff)

	var totalServices int64
	config.DB.Model(&service_catalog.ServiceItem{}).Where("is_active = ?", true).Count(&totalServices)

	var totalExpenses float64
	config.DB.Model(&financeModel.Expense{}).Select("COALESCE(SUM(amount), 0)").Scan(&totalExpenses)

	type StatusCount struct {
		Status string `json:"status"`
		Count  int    `json:"count"`
	}
	var statusCounts []StatusCount
	config.DB.Model(&order.Order{}).Select("status, count(*) as count").Group("status").Scan(&statusCounts)

	type ServiceStat struct {
		ServiceType string  `json:"service_type"`
		Count       int64   `json:"count"`
		WeightKg    float64 `json:"weight_kg"`
		Revenue     float64 `json:"revenue"`
	}
	var serviceStats []ServiceStat
	config.DB.Model(&order.Order{}).
		Select("service_type, COUNT(*) as count, COALESCE(SUM(weight_kg), 0) as weight_kg, COALESCE(SUM(total_amount), 0) as revenue").
		Group("service_type").Scan(&serviceStats)

	type AreaStat struct {
		Area  string `json:"area"`
		Count int64  `json:"count"`
	}
	var areaStats []AreaStat
	config.DB.Model(&profile.Customer{}).
		Select("COALESCE(NULLIF(area, ''), 'Sleman') as area, COUNT(*) as count").
		Group("area").Scan(&areaStats)

	type PaymentStat struct {
		PaymentMethod string  `json:"payment_method"`
		Count         int64   `json:"count"`
		Revenue       float64 `json:"revenue"`
	}
	var paymentStats []PaymentStat
	config.DB.Model(&order.Order{}).
		Select("payment_method, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue").
		Group("payment_method").Scan(&paymentStats)

	var recentOrders []order.Order
	config.DB.Preload("Customer").Preload("Items").Order("created_at DESC").Limit(10).Find(&recentOrders)

	var topCustomers []profile.Customer
	config.DB.Preload("Package").Order("total_orders DESC, remaining_quota DESC").Limit(5).Find(&topCustomers)

	response.Success(c, http.StatusOK, "Statistik dashboard berhasil dimuat", gin.H{
		"today_orders":         todayOrders,
		"total_orders":         totalOrders,
		"today_revenue":        todayRevenue,
		"total_order_revenue":  totalOrderRevenue,
		"package_revenue":      packageRevenue,
		"total_revenue":        totalOrderRevenue + packageRevenue,
		"total_expenses":       totalExpenses,
		"total_weight_kg":      totalWeightKg,
		"active_orders":        activeOrders,
		"express_active_count": expressActiveCount,
		"total_customers":      totalCustomers,
		"member_customers":     memberCustomers,
		"total_staff":          totalStaff,
		"total_services":       totalServices,
		"status_breakdown":     statusCounts,
		"service_breakdown":    serviceStats,
		"area_breakdown":       areaStats,
		"payment_breakdown":    paymentStats,
		"recent_orders":        recentOrders,
		"top_customers":        topCustomers,
		"timestamp":            now.Format(time.RFC3339),
	})
}
