package production

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"
	productionView "kucek-backend/views/superadmin/production"

	"github.com/gin-gonic/gin"
)

type KanbanController struct{}

func NewKanbanController() *KanbanController {
	return &KanbanController{}
}

func (k *KanbanController) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	var req productionView.UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Status yang dimasukkan tidak valid", err)
		return
	}

	var ord order.Order
	if err := config.DB.First(&ord, id).Error; err != nil {
		response.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	ord.Status = order.OrderStatus(req.Status)
	if err := config.DB.Save(&ord).Error; err != nil {
		response.InternalError(c, "Gagal memperbarui status pesanan", err)
		return
	}

	title := "Status Pesanan Diperbarui"
	switch req.Status {
	case string(order.StatusCuci):
		title = "Proses Pencucian (1 Mesin 1 Pelanggan)"
	case string(order.StatusKering):
		title = "Pengeringan Tabung Panas Suhu Terkontrol"
	case string(order.StatusSetrika):
		title = "Setrika Uap & Quality Control"
	case string(order.StatusPacking):
		title = "Packing Higienis & Siap Diambil/Kirim"
	case string(order.StatusSelesai):
		title = "Pesanan Selesai / Telah Diterima Pelanggan"
	}

	logEntry := tracking.TrackingLog{
		OrderID:     ord.ID,
		OrderNumber: ord.OrderNumber,
		Status:      req.Status,
		Title:       title,
		Description: req.Description,
		Location:    req.Location,
		UpdatedBy:   "Operator Produksi",
		Timestamp:   time.Now(),
	}
	config.DB.Create(&logEntry)

	config.DB.Preload("Customer").Preload("Items").Preload("Tracking").First(&ord, ord.ID)
	response.Success(c, http.StatusOK, "Status produksi berhasil diperbarui", ord)
}
