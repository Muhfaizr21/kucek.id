package dashboard

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type CustomerHubController struct{}

func NewCustomerHubController() *CustomerHubController {
	return &CustomerHubController{}
}

func (ch *CustomerHubController) GetHubOverview(c *gin.Context) {
	userID, _ := c.Get("userID")

	var customer profile.Customer
	if err := config.DB.Preload("Package").Where("user_id = ?", userID).First(&customer).Error; err != nil {
		response.NotFound(c, "Profil pelanggan tidak ditemukan")
		return
	}

	var activeOrders []order.Order
	config.DB.Preload("Tracking").
		Where("customer_id = ? AND status != ?", customer.ID, order.StatusSelesai).
		Order("created_at DESC").Find(&activeOrders)

	response.Success(c, http.StatusOK, "Ringkasan portal pelanggan berhasil dimuat", gin.H{
		"customer":      customer,
		"active_orders": activeOrders,
	})
}
