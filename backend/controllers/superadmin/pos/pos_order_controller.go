package pos

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
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
		area := req.CustomerArea
		if area == "" {
			area = "Sleman (Zona Gratis Ongkir)"
		}
		customer = profile.Customer{
			Name:    req.CustomerName,
			Phone:   req.CustomerPhone,
			Address: req.Address,
			Area:    area,
		}
		if err := tx.Create(&customer).Error; err != nil {
			tx.Rollback()
			response.InternalError(c, "Gagal membuat data pelanggan", err)
			return
		}
	} else {
		updated := false
		if req.CustomerName != "" && customer.Name != req.CustomerName {
			customer.Name = req.CustomerName
			updated = true
		}
		if req.Address != "" && customer.Address != req.Address {
			customer.Address = req.Address
			updated = true
		}
		if updated {
			tx.Save(&customer)
		}
	}

	now := time.Now()
	var totalOrderCount int64
	tx.Model(&order.Order{}).Count(&totalOrderCount)
	orderNumber := fmt.Sprintf("KCK-%d-%03d", now.Year(), totalOrderCount+1)

	var subtotal float64
	var orderItems []order.OrderItem

	pricePerKg := req.PricePerKg
	if pricePerKg <= 0 {
		pricePerKg = 8000
	}

	// Hitung kiloan jika weight > 0
	if req.WeightKg > 0 {
		subtotal += req.WeightKg * pricePerKg
	}

	// Hitung item satuan jika ada
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

	paymentMethod := strings.ToLower(req.PaymentMethod)
	if paymentMethod == "" {
		paymentMethod = "cash"
	}

	var quotaUsedKg float64
	kiloanCost := req.WeightKg * pricePerKg
	discount := req.Discount

	if (paymentMethod == "package" || paymentMethod == "kuota") && req.WeightKg > 0 && customer.RemainingQuota > 0 {
		if customer.RemainingQuota >= req.WeightKg {
			quotaUsedKg = req.WeightKg
			customer.RemainingQuota -= req.WeightKg
			discount += kiloanCost
		} else {
			quotaUsedKg = customer.RemainingQuota
			discount += quotaUsedKg * pricePerKg
			customer.RemainingQuota = 0
		}
		tx.Save(&customer)
	}

	totalAmount := subtotal - discount + req.DeliveryFee
	if totalAmount < 0 {
		totalAmount = 0
	}

	paymentStatus := order.PaymentUnpaid
	if req.PaymentStatus == "paid" || totalAmount == 0 {
		paymentStatus = order.PaymentPaid
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
		PricePerKg:    pricePerKg,
		Subtotal:      subtotal,
		Discount:      discount,
		QuotaUsedKg:   quotaUsedKg,
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
		Title:       "Cucian Diterima Kasir POS",
		Description: fmt.Sprintf("Nota %s (%s • %.2f Kg) berhasil dicetak di kasir.", orderNumber, req.ServiceType, req.WeightKg),
		Location:    "Outlet Utama Kucek.id",
		UpdatedBy:   "Kasir POS",
		Timestamp:   now,
	}
	tx.Create(&initialLog)

	tx.Model(&customer).Updates(map[string]interface{}{
		"total_orders":   customer.TotalOrders + 1,
		"loyalty_points": customer.LoyaltyPoints + 15,
	})
	tx.Commit()

	config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&newOrder, newOrder.ID)

	response.Success(c, http.StatusCreated, "Transaksi Kasir POS berhasil disimpan", newOrder)
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
	config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&ord, ord.ID)
	response.Success(c, http.StatusOK, "Status pembayaran berhasil diperbarui", ord)
}
