package tracking

import (
	"net/http"
	"strings"

	"kucek-backend/config"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type TrackingController struct{}

func NewTrackingController() *TrackingController {
	return &TrackingController{}
}

func (t *TrackingController) TrackOrder(c *gin.Context) {
	orderNumber := strings.TrimSpace(c.Param("order_number"))
	if orderNumber == "" {
		response.BadRequest(c, "Nomor resi pesanan harus diisi", nil)
		return
	}

	var ord order.Order
	if err := config.DB.Preload("Customer").Preload("Items").Preload("Tracking").
		Where("order_number ILIKE ?", orderNumber).First(&ord).Error; err != nil {
		response.NotFound(c, "Nomor resi tidak ditemukan. Mohon periksa kembali nomor resi Anda.")
		return
	}

	maskedPhone := ord.Customer.Phone
	if len(maskedPhone) > 7 {
		maskedPhone = maskedPhone[:4] + "****" + maskedPhone[len(maskedPhone)-3:]
	}

	response.Success(c, http.StatusOK, "Status pesanan ditemukan", gin.H{
		"order_number":   ord.OrderNumber,
		"customer_name":  ord.Customer.Name,
		"customer_phone": maskedPhone,
		"service_type":   ord.ServiceType,
		"weight_kg":      ord.WeightKg,
		"fragrance":      ord.Fragrance,
		"total_amount":   ord.TotalAmount,
		"status":         ord.Status,
		"payment_status": ord.PaymentStatus,
		"items":          ord.Items,
		"timeline":       ord.Tracking,
		"created_at":     ord.CreatedAt,
	})
}
