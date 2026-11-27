package history

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
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
		response.NotFound(c, "Profil pelanggan tidak ditemukan")
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
