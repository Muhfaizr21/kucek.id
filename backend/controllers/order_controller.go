package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"kucek-backend/config"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
)

type OrderController struct{}

func NewOrderController() *OrderController {
	return &OrderController{}
}

func (o *OrderController) ListOrders(c *gin.Context) {
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

	var orders []models.Order
	if err := query.Find(&orders).Error; err != nil {
		views.InternalError(c, "Gagal mengambil daftar pesanan", err)
		return
	}

	views.Success(c, http.StatusOK, "Daftar pesanan berhasil dimuat", orders)
}

func (o *OrderController) GetOrderByID(c *gin.Context) {
	id := c.Param("id")

	var order models.Order
	if err := config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&order, id).Error; err != nil {
		views.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	views.Success(c, http.StatusOK, "Detail pesanan berhasil dimuat", order)
}

func (o *OrderController) CreateOrder(c *gin.Context) {
	var req views.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		views.BadRequest(c, "Data pesanan tidak valid", err)
		return
	}

	tx := config.DB.Begin()

	// 1. Cari atau buat customer berdasarkan nomor telepon
	var customer models.Customer
	if err := tx.Where("phone = ?", req.CustomerPhone).First(&customer).Error; err != nil {
		customer = models.Customer{
			Name:    req.CustomerName,
			Phone:   req.CustomerPhone,
			Address: req.Address,
			Area:    req.CustomerArea,
		}
		if err := tx.Create(&customer).Error; err != nil {
			tx.Rollback()
			views.InternalError(c, "Gagal membuat data pelanggan", err)
			return
		}
	} else {
		// Update alamat jika baru
		if req.Address != "" && customer.Address != req.Address {
			customer.Address = req.Address
			tx.Save(&customer)
		}
	}

	// 2. Hitung harga dan buat nomor resi unik
	now := time.Now()
	var countToday int64
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	tx.Model(&models.Order{}).Where("created_at >= ?", todayStart).Count(&countToday)
	orderNumber := fmt.Sprintf("KCK-%s-%04d", now.Format("20060102"), countToday+1)

	var subtotal float64
	var orderItems []models.OrderItem

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
			orderItems = append(orderItems, models.OrderItem{
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

	paymentStatus := models.PaymentUnpaid
	if req.PaymentStatus == "paid" {
		paymentStatus = models.PaymentPaid
	}

	paymentMethod := "cash"
	if req.PaymentMethod != "" {
		paymentMethod = req.PaymentMethod
	}

	fragrance := "ocean_fresh"
	if req.Fragrance != "" {
		fragrance = req.Fragrance
	}

	order := models.Order{
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
		Status:        models.StatusTerima,
		PaymentStatus: paymentStatus,
		PaymentMethod: paymentMethod,
		Notes:         req.Notes,
		Items:         orderItems,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		views.InternalError(c, "Gagal menyimpan pesanan baru", err)
		return
	}

	// 3. Tambahkan Tracking Log Awal
	initialLog := models.TrackingLog{
		OrderID:     order.ID,
		OrderNumber: order.OrderNumber,
		Status:      string(models.StatusTerima),
		Title:       "Cucian Diterima Kasir",
		Description: fmt.Sprintf("Pesanan laundry %s diterima dan tercatat di sistem.", req.ServiceType),
		Location:    "Kucek Hub Utama",
		UpdatedBy:   "Kasir POS",
		Timestamp:   time.Now(),
	}
	tx.Create(&initialLog)

	// Update customer total orders
	tx.Model(&customer).Update("total_orders", customer.TotalOrders+1)

	tx.Commit()

	// Muat order lengkap untuk respons
	config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&order, order.ID)

	views.Success(c, http.StatusCreated, "Pesanan laundry berhasil dibuat", order)
}

func (o *OrderController) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	var req views.UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		views.BadRequest(c, "Status yang dimasukkan tidak valid", err)
		return
	}

	var order models.Order
	if err := config.DB.First(&order, id).Error; err != nil {
		views.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	order.Status = models.OrderStatus(req.Status)
	if err := config.DB.Save(&order).Error; err != nil {
		views.InternalError(c, "Gagal memperbarui status pesanan", err)
		return
	}

	// Buat tracking history event
	title := "Status Pesanan Diperbarui"
	switch req.Status {
	case string(models.StatusCuci):
		title = "Proses Pencucian (1 Mesin 1 Pelanggan)"
	case string(models.StatusKering):
		title = "Pengeringan Tabung Panas Suhu Terkontrol"
	case string(models.StatusSetrika):
		title = "Setrika Uap & Quality Control"
	case string(models.StatusPacking):
		title = "Packing Higienis & Siap Diambil/Kirim"
	case string(models.StatusSelesai):
		title = "Pesanan Selesai / Telah Diterima Pelanggan"
	}

	tracking := models.TrackingLog{
		OrderID:     order.ID,
		OrderNumber: order.OrderNumber,
		Status:      req.Status,
		Title:       title,
		Description: req.Description,
		Location:    req.Location,
		UpdatedBy:   "Operator Produksi",
		Timestamp:   time.Now(),
	}
	config.DB.Create(&tracking)

	config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&order, order.ID)

	views.Success(c, http.StatusOK, "Status pesanan berhasil diperbarui", order)
}

func (o *OrderController) UpdatePayment(c *gin.Context) {
	id := c.Param("id")
	type PayReq struct {
		PaymentStatus string `json:"payment_status" binding:"required"`
		PaymentMethod string `json:"payment_method"`
	}
	var req PayReq
	if err := c.ShouldBindJSON(&req); err != nil {
		views.BadRequest(c, "Data pembayaran tidak valid", err)
		return
	}

	var order models.Order
	if err := config.DB.First(&order, id).Error; err != nil {
		views.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	order.PaymentStatus = models.PaymentStatus(req.PaymentStatus)
	if req.PaymentMethod != "" {
		order.PaymentMethod = req.PaymentMethod
	}

	config.DB.Save(&order)

	views.Success(c, http.StatusOK, "Status pembayaran berhasil diperbarui", order)
}
