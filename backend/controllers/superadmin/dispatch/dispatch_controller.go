package dispatch

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type DispatchController struct{}

func NewDispatchController() *DispatchController {
	return &DispatchController{}
}

func (d *DispatchController) ListPickupDeliveries(c *gin.Context) {
	var orders []order.Order
	if err := config.DB.Preload("Customer").Order("created_at DESC").Limit(30).Find(&orders).Error; err != nil {
		response.InternalError(c, "Gagal memuat jadwal kurir antar-jemput", err)
		return
	}
	response.Success(c, http.StatusOK, "Jadwal antar-jemput kurir berhasil dimuat", orders)
}
