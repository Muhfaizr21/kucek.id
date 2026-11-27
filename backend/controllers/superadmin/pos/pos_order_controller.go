package pos

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"
	posView "kucek-backend/views/superadmin/pos"

	"github.com/gin-gonic/gin"
)

type PosOrderController struct{}

func NewPosOrderController() *PosOrderController {
	return &PosOrderController{}
}

func (o *PosOrderController) ListOrders(c *gin.Context) {
	status := c.Query("status")
	search := c.Query("search")
	limitStr := c.DefaultQuery("limit", "50")
	limit, _ := strconv.Atoi(limitStr)

	query := config.DB.Preload("Customer").Preload("Items").Preload("Tracking").Order("created_at DESC").Limit(limit)

	if status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}

	if search != "" {
		likeTerm := "%" + search + "%"
		query = query.Joins("JOIN customers ON customers.id = orders.customer_id").
			Where("orders.order_number ILIKE ? OR customers.name ILIKE ? OR customers.phone ILIKE ?", likeTerm, likeTerm, likeTerm)
	}

	var orders []order.Order
	if err := query.Find(&orders).Error; err != nil {
		response.InternalError(c, "Gagal mengambil daftar pesanan", err)
		return
	}

	response.Success(c, http.StatusOK, "Daftar pesanan berhasil dimuat", orders)
}

func (o *PosOrderController) GetOrderByID(c *gin.Context) {
	id := c.Param("id")

	var ord order.Order
	if err := config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&ord, id).Error; err != nil {
		response.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	response.Success(c, http.StatusOK, "Detail pesanan berhasil dimuat", ord)
}

func (o *PosOrderController) CreateOrder(c *gin.Context) {
	var req posView.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data pesanan tidak valid", err)
		return
	}

	tx := config.DB.Begin()

	var customer profile.Customer
	if err := tx.Where("phone = ?", req.CustomerPhone).First(&customer).Error; err != nil {
		customer = profile.Customer{
			Name:    req.CustomerName,
			Phone:   req.CustomerPhone,
			Address: req.Address,
			Area:    req.CustomerArea,
		}
		if err := tx.Create(&customer).Error; err != nil {
			tx.Rollback()
			response.InternalError(c, "Gagal membuat data pelanggan", err)
			return
		}
	} else if req.Address != "" && customer.Address != req.Address {
		customer.Address = req.Address
		tx.Save(&customer)
	}

	now := time.Now()
	var countToday int64
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	tx.Model(&order.Order{}).Where("created_at >= ?", todayStart).Count(&countToday)
	orderNumber := fmt.Sprintf("KCK-%s-%04d", now.Format("20060102"), countToday+1)

	var subtotal float64
	var orderItems []order.OrderItem

	if req.ServiceType == "kiloan" {
		pricePerKg := req.PricePerKg
		if pricePerKg <= 0 {
			pricePerKg = 8000
		}
		subtotal = req.WeightKg * pricePerKg
	} else {
		for _, item := range req.Items {
			itemTotal := float64(item.Quantity) * item.UnitPrice
			subtotal += itemTotal
			orderItems = append(orderItems, order.OrderItem{
				ItemName:   item.ItemName,
				Quantity:   item.Quantity,
				UnitPrice:  item.UnitPrice,
				TotalPrice: itemTotal,
			})
		}
	}

	totalAmount := subtotal - req.Discount + req.DeliveryFee
	if totalAmount < 0 {
		totalAmount = 0
	}

	paymentStatus := order.PaymentUnpaid
	if req.PaymentStatus == "paid" {
		paymentStatus = order.PaymentPaid
	}

	paymentMethod := "cash"
	if req.PaymentMethod != "" {
		paymentMethod = req.PaymentMethod
	}

	fragrance := "ocean_fresh"
	if req.Fragrance != "" {
		fragrance = req.Fragrance
	}

	newOrder := order.Order{
		OrderNumber:   orderNumber,
		CustomerID:    customer.ID,
		ServiceType:   req.ServiceType,
		WeightKg:      req.WeightKg,
		Fragrance:     fragrance,
		PricePerKg:    req.PricePerKg,
		Subtotal:      subtotal,
		Discount:      req.Discount,
		DeliveryFee:   req.DeliveryFee,
		TotalAmount:   totalAmount,
		Status:        order.StatusTerima,
		PaymentStatus: paymentStatus,
		PaymentMethod: paymentMethod,
		Notes:         req.Notes,
		Items:         orderItems,
	}

	if err := tx.Create(&newOrder).Error; err != nil {
		tx.Rollback()
		response.InternalError(c, "Gagal menyimpan pesanan baru", err)
		return
	}

	initialLog := tracking.TrackingLog{
		OrderID:     newOrder.ID,
		OrderNumber: newOrder.OrderNumber,
		Status:      string(order.StatusTerima),
		Title:       "Cucian Diterima Kasir",
		Description: fmt.Sprintf("Pesanan laundry %s diterima dan tercatat di sistem.", req.ServiceType),
		Location:    "Kucek Hub Utama",
		UpdatedBy:   "Kasir POS",
		Timestamp:   time.Now(),
	}
	tx.Create(&initialLog)

	tx.Model(&customer).Update("total_orders", customer.TotalOrders+1)
	tx.Commit()

	config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&newOrder, newOrder.ID)

	response.Success(c, http.StatusCreated, "Pesanan laundry berhasil dibuat", newOrder)
}

func (o *PosOrderController) UpdatePayment(c *gin.Context) {
	id := c.Param("id")
	var req posView.UpdatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data pembayaran tidak valid", err)
		return
	}

	var ord order.Order
	if err := config.DB.First(&ord, id).Error; err != nil {
		response.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	ord.PaymentStatus = order.PaymentStatus(req.PaymentStatus)
	if req.PaymentMethod != "" {
		ord.PaymentMethod = req.PaymentMethod
	}

	config.DB.Save(&ord)
	response.Success(c, http.StatusOK, "Status pembayaran berhasil diperbarui", ord)
}
