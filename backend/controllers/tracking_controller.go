package controllers

import (
	"net/http"
	"strings"

	"kucek-backend/config"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
)

type TrackingController struct{}

func NewTrackingController() *TrackingController {
	return &TrackingController{}
}

// TrackOrder handles public order tracking via resi number (e.g. KCK-2026-001)
func (t *TrackingController) TrackOrder(c *gin.Context) {
	orderNumber := strings.TrimSpace(c.Param("order_number"))
	if orderNumber == "" {
		views.BadRequest(c, "Nomor resi pesanan harus diisi", nil)
		return
	}

	var order models.Order
	if err := config.DB.Preload("Customer").Preload("Items").Preload("Tracking").
		Where("order_number ILIKE ?", orderNumber).First(&order).Error; err != nil {
		views.NotFound(c, "Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi Anda.")
		return
	}

	// Sembunyikan sebagian nomor telepon pelanggan untuk privasi publik
	maskedPhone := order.Customer.Phone
	if len(maskedPhone) > 7 {
		maskedPhone = maskedPhone[:4] + "****" + maskedPhone[len(maskedPhone)-3:]
	}

	views.Success(c, http.StatusOK, "Status pesanan ditemukan", gin.H{
		"order_number":   order.OrderNumber,
		"customer_name":  order.Customer.Name,
		"customer_phone": maskedPhone,
		"service_type":   order.ServiceType,
		"weight_kg":      order.WeightKg,
		"fragrance":      order.Fragrance,
		"total_amount":   order.TotalAmount,
		"status":         order.Status,
		"payment_status": order.PaymentStatus,
		"items":          order.Items,
		"timeline":       order.Tracking,
		"created_at":     order.CreatedAt,
	})
}
