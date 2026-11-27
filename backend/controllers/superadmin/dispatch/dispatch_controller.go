package dispatch

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/auth/account"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type DispatchController struct{}

func NewDispatchController() *DispatchController {
	return &DispatchController{}
}

type AssignCourierRequest struct {
	CourierName  string `json:"courier_name" binding:"required"`
	DispatchTask string `json:"dispatch_task"` // "JEMPUT" atau "ANTAR"
	UpdateStatus string `json:"update_status"` // optional order status override
}

func (d *DispatchController) ListPickupDeliveries(c *gin.Context) {
	var orders []order.Order
	if err := config.DB.Preload("Customer").Preload("Tracking").Order("created_at DESC").Limit(40).Find(&orders).Error; err != nil {
		response.InternalError(c, "Gagal memuat jadwal kurir antar-jemput", err)
		return
	}

	var couriers []account.User
	config.DB.Where("role = ? AND is_active = ?", account.RoleKurir, true).Order("name ASC").Find(&couriers)

	response.Success(c, http.StatusOK, "Jadwal antar-jemput kurir berhasil dimuat", gin.H{
		"orders":   orders,
		"couriers": couriers,
	})
}

func (d *DispatchController) AssignCourier(c *gin.Context) {
	id := c.Param("id")
	var ord order.Order
	if err := config.DB.Preload("Customer").First(&ord, id).Error; err != nil {
		response.NotFound(c, "Pesanan tidak ditemukan")
		return
	}

	var req AssignCourierRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Nama kurir wajib diisi", err)
		return
	}

	// Update notes with assigned courier tag
	cleanNotes := ord.Notes
	if idx := strings.Index(cleanNotes, "• Kurir:"); idx != -1 {
		cleanNotes = strings.TrimSpace(cleanNotes[:idx])
	}
	if cleanNotes != "" {
		ord.Notes = fmt.Sprintf("%s • Kurir: %s", cleanNotes, req.CourierName)
	} else {
		ord.Notes = fmt.Sprintf("Kurir: %s", req.CourierName)
	}

	now := time.Now()
	taskType := strings.ToUpper(req.DispatchTask)
	logTitle := fmt.Sprintf("Kurir %s Ditugaskan Menjemput Cucian", req.CourierName)
	logDesc := fmt.Sprintf("Armada kurir (%s) sedang menuju lokasi %s untuk penjemputan.", req.CourierName, ord.Customer.Address)

	if taskType == "ANTAR" || ord.Status == order.StatusPacking || ord.Status == order.StatusSelesai {
		ord.DeliveryTime = &now
		logTitle = fmt.Sprintf("Kurir %s Mengantar Cucian Bersih", req.CourierName)
		logDesc = fmt.Sprintf("Cucian bersih sedang dibawa kurir %s menuju alamat %s.", req.CourierName, ord.Customer.Address)
	} else {
		ord.PickupTime = &now
	}

	if req.UpdateStatus != "" {
		ord.Status = order.OrderStatus(req.UpdateStatus)
	}

	if err := config.DB.Save(&ord).Error; err != nil {
		response.InternalError(c, "Gagal menugaskan kurir", err)
		return
	}

	trackLog := tracking.TrackingLog{
		OrderID:     ord.ID,
		OrderNumber: ord.OrderNumber,
		Status:      string(ord.Status),
		Title:       logTitle,
		Description: logDesc,
		Location:    ord.Customer.Address,
		UpdatedBy:   req.CourierName,
		Timestamp:   now,
	}
	config.DB.Create(&trackLog)

	config.DB.Preload("Customer").Preload("Tracking").First(&ord, ord.ID)
	response.Success(c, http.StatusOK, "Kurir berhasil ditugaskan", ord)
}
