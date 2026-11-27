package pickup

import (
	"fmt"
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"
	pickupView "kucek-backend/views/pelanggan/pickup"

	"github.com/gin-gonic/gin"
)

type BookPickupController struct{}

func NewBookPickupController() *BookPickupController {
	return &BookPickupController{}
}

func (b *BookPickupController) BookPickup(c *gin.Context) {
	var req pickupView.BookPickupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data permintaan jemput cucian belum lengkap", err)
		return
	}

	userID, _ := c.Get("userID")
	var customer profile.Customer
	if err := config.DB.Where("user_id = ?", userID).First(&customer).Error; err != nil {
		response.NotFound(c, "Profil pelanggan tidak ditemukan")
		return
	}

	now := time.Now()
	var countToday int64
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	config.DB.Model(&order.Order{}).Where("created_at >= ?", todayStart).Count(&countToday)
	orderNumber := fmt.Sprintf("KCK-%s-%04d", now.Format("20060102"), countToday+1)

	serviceType := req.ServiceType
	if serviceType == "" {
		serviceType = "kiloan"
	}

	fragrance := req.Fragrance
	if fragrance == "" {
		fragrance = "ocean_fresh"
	}

	newOrder := order.Order{
		OrderNumber:   orderNumber,
		CustomerID:    customer.ID,
		ServiceType:   serviceType,
		WeightKg:      req.WeightKg,
		Fragrance:     fragrance,
		PricePerKg:    8000,
		Subtotal:      req.WeightKg * 8000,
		TotalAmount:   req.WeightKg * 8000,
		Status:        order.StatusTerima,
		PaymentStatus: order.PaymentUnpaid,
		PaymentMethod: "qris",
		Notes:         fmt.Sprintf("Jemput %s (%s) - %s", req.PickupDate, req.TimeSlot, req.Notes),
	}

	if err := config.DB.Create(&newOrder).Error; err != nil {
		response.InternalError(c, "Gagal membuat jadwal penjemputan", err)
		return
	}

	initialLog := tracking.TrackingLog{
		OrderID:     newOrder.ID,
		OrderNumber: newOrder.OrderNumber,
		Status:      string(order.StatusTerima),
		Title:       "Permintaan Jemput Cucian Terjadwal",
		Description: fmt.Sprintf("Kurir dijadwalkan menjemput pada %s sesi %s di %s.", req.PickupDate, req.TimeSlot, req.Address),
		Location:    req.Address,
		UpdatedBy:   customer.Name,
		Timestamp:   now,
	}
	config.DB.Create(&initialLog)

	response.Success(c, http.StatusCreated, "Penjemputan cucian berhasil dijadwalkan", newOrder)
}
