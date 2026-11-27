package finance

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	financeModel "kucek-backend/models/superadmin/finance"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type FinanceController struct{}

func NewFinanceController() *FinanceController {
	return &FinanceController{}
}

type CreateExpenseRequest struct {
	Title         string  `json:"title" binding:"required"`
	Category      string  `json:"category" binding:"required"`
	Amount        float64 `json:"amount" binding:"required,gt=0"`
	PaymentMethod string  `json:"payment_method"`
	ExpenseDate   string  `json:"expense_date"`
	PIC           string  `json:"pic"`
	Notes         string  `json:"notes"`
}

func (f *FinanceController) GetSummary(c *gin.Context) {
	var totalPaidOrderRevenue float64
	config.DB.Model(&order.Order{}).Where("payment_status = ?", order.PaymentPaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalPaidOrderRevenue)

	var totalUnpaidAmount float64
	config.DB.Model(&order.Order{}).Where("payment_status = ?", order.PaymentUnpaid).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&totalUnpaidAmount)

	// Hitung pendapatan dari paket aktif pelanggan
	var customersWithPkg []profile.Customer
	config.DB.Preload("Package").Where("package_id IS NOT NULL").Find(&customersWithPkg)
	var packageRevenue float64
	for _, cust := range customersWithPkg {
		if cust.Package != nil {
			packageRevenue += cust.Package.Price
		}
	}

	totalRevenue := totalPaidOrderRevenue + packageRevenue

	var totalExpenses float64
	config.DB.Model(&financeModel.Expense{}).Select("COALESCE(SUM(amount), 0)").Scan(&totalExpenses)

	netProfit := totalRevenue - totalExpenses
	profitMargin := 0.0
	if totalRevenue > 0 {
		profitMargin = (netProfit / totalRevenue) * 100
	}

	var totalTransactions int64
	config.DB.Model(&order.Order{}).Count(&totalTransactions)

	// Breakdown by service type
	type ServiceBreakdown struct {
		ServiceType string  `json:"service_type"`
		Revenue     float64 `json:"revenue"`
		Count       int64   `json:"count"`
	}
	var serviceBreakdown []ServiceBreakdown
	config.DB.Model(&order.Order{}).
		Select("service_type, COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as count").
		Group("service_type").Scan(&serviceBreakdown)

	// Breakdown by payment method
	type PaymentBreakdown struct {
		PaymentMethod string  `json:"payment_method"`
		Revenue       float64 `json:"revenue"`
		Count         int64   `json:"count"`
	}
	var paymentBreakdown []PaymentBreakdown
	config.DB.Model(&order.Order{}).
		Select("payment_method, COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as count").
		Group("payment_method").Scan(&paymentBreakdown)

	// Breakdown by expense category
	type ExpenseCategoryBreakdown struct {
		Category string  `json:"category"`
		Total    float64 `json:"total"`
		Count    int64   `json:"count"`
	}
	var expenseBreakdown []ExpenseCategoryBreakdown
	config.DB.Model(&financeModel.Expense{}).
		Select("category, COALESCE(SUM(amount), 0) as total, COUNT(*) as count").
		Group("category").Scan(&expenseBreakdown)

	var expenses []financeModel.Expense
	config.DB.Order("expense_date DESC, id DESC").Limit(50).Find(&expenses)

	var recentOrders []order.Order
	config.DB.Preload("Customer").Order("created_at DESC").Limit(20).Find(&recentOrders)

	response.Success(c, http.StatusOK, "Ringkasan laporan keuangan berhasil dimuat", gin.H{
		"total_paid_revenue":     totalRevenue,
		"order_paid_revenue":     totalPaidOrderRevenue,
		"package_revenue":        packageRevenue,
		"total_unpaid_amount":    totalUnpaidAmount,
		"total_expenses":         totalExpenses,
		"net_profit":             netProfit,
		"profit_margin":          profitMargin,
		"total_transactions":     totalTransactions,
		"service_breakdown":      serviceBreakdown,
		"payment_breakdown":      paymentBreakdown,
		"expense_breakdown":      expenseBreakdown,
		"expenses":               expenses,
		"recent_orders":          recentOrders,
	})
}

func (f *FinanceController) ListExpenses(c *gin.Context) {
	var expenses []financeModel.Expense
	if err := config.DB.Order("expense_date DESC, id DESC").Find(&expenses).Error; err != nil {
		response.InternalError(c, "Gagal memuat daftar pengeluaran toko", err)
		return
	}
	response.Success(c, http.StatusOK, "Daftar pengeluaran toko berhasil dimuat", expenses)
}

func (f *FinanceController) CreateExpense(c *gin.Context) {
	var req CreateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data pengeluaran tidak valid", err)
		return
	}

	expDate := time.Now()
	if req.ExpenseDate != "" {
		if parsed, err := time.Parse("2006-01-02", req.ExpenseDate); err == nil {
			expDate = parsed
		}
	}

	paymentMethod := req.PaymentMethod
	if paymentMethod == "" {
		paymentMethod = "Tunai Kasir"
	}
	pic := req.PIC
	if pic == "" {
		pic = "Superadmin Owner"
	}

	exp := financeModel.Expense{
		Title:         req.Title,
		Category:      req.Category,
		Amount:        req.Amount,
		PaymentMethod: paymentMethod,
		ExpenseDate:   expDate,
		PIC:           pic,
		Notes:         req.Notes,
	}

	if err := config.DB.Create(&exp).Error; err != nil {
		response.InternalError(c, "Gagal mencatat pengeluaran toko", err)
		return
	}

	response.Success(c, http.StatusCreated, "Pengeluaran toko berhasil dicatat", exp)
}

func (f *FinanceController) DeleteExpense(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&financeModel.Expense{}, id).Error; err != nil {
		response.InternalError(c, "Gagal menghapus data pengeluaran", err)
		return
	}
	response.Success(c, http.StatusOK, "Catatan pengeluaran berhasil dihapus", gin.H{"deleted_id": id})
}
