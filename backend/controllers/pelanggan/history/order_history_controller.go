package history

import (
	"fmt"
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/controllers/pelanggan/common"
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
	customer, err := common.ResolveCustomerFromContext(c, false)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
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

	customer, err := common.ResolveCustomerFromContext(c, false)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	var ord order.Order
	if err := config.DB.Where("id = ? OR order_number = ?", orderID, orderID).First(&ord).Error; err != nil {
		response.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	// Cegah IDOR: Pastikan pesanan benar-benar milik pelanggan yang login
	if ord.CustomerID != customer.ID {
		response.Forbidden(c, "Anda tidak memiliki hak akses untuk membayar pesanan ini")
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
