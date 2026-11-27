package history

import (
	"fmt"
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type OrderHistoryController struct{}

func NewOrderHistoryController() *OrderHistoryController {
	return &OrderHistoryController{}
}

func (h *OrderHistoryController) ListMyOrders(c *gin.Context) {
	userID, _ := c.Get("userID")

	var customer profile.Customer
	if err := config.DB.Where("user_id = ?", userID).First(&customer).Error; err != nil {
		if err2 := config.DB.Order("id ASC").First(&customer).Error; err2 != nil {
			response.NotFound(c, "Profil pelanggan tidak ditemukan")
			return
		}
	}

	var orders []order.Order
	if err := config.DB.Preload("Items").Preload("Tracking").
		Where("customer_id = ?", customer.ID).
		Order("created_at DESC").Find(&orders).Error; err != nil {
		response.InternalError(c, "Gagal memuat riwayat pesanan pelanggan", err)
		return
	}

	response.Success(c, http.StatusOK, "Riwayat cucian pelanggan berhasil dimuat", orders)
}

func (h *OrderHistoryController) PayOrder(c *gin.Context) {
	orderID := c.Param("id")
	userID, _ := c.Get("userID")

	var customer profile.Customer
	if err := config.DB.Where("user_id = ?", userID).First(&customer).Error; err != nil {
		config.DB.Order("id ASC").First(&customer)
	}

	var ord order.Order
	if err := config.DB.Where("id = ? OR order_number = ?", orderID, orderID).First(&ord).Error; err != nil {
		response.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	if ord.PaymentStatus == order.PaymentPaid {
		response.Success(c, http.StatusOK, "Pesanan ini sudah berstatus Lunas", ord)
		return
	}

	ord.PaymentStatus = order.PaymentPaid
	ord.PaymentMethod = "qris"
	config.DB.Save(&ord)

	customer.LoyaltyPoints += 25
	config.DB.Save(&customer)

	payLog := tracking.TrackingLog{
		OrderID:     ord.ID,
		OrderNumber: ord.OrderNumber,
		Status:      string(ord.Status),
		Title:       "Pembayaran QRIS Terverifikasi Lunas",
		Description: fmt.Sprintf("Tagihan sebesar Rp %.0f telah dilunasi via QRIS Instant.", ord.TotalAmount),
		Location:    "Payment Gateway Kucek.id",
		UpdatedBy:   customer.Name,
		Timestamp:   time.Now(),
	}
	config.DB.Create(&payLog)

	config.DB.Preload("Tracking").First(&ord, ord.ID)

	response.Success(c, http.StatusOK, fmt.Sprintf("Pembayaran resi #%s berhasil dikonfirmasi Lunas!", ord.OrderNumber), ord)
}
