package dashboard

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/controllers/pelanggan/common"
	voucherModel "kucek-backend/models/pelanggan/voucher"
	"kucek-backend/models/superadmin/order"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type CustomerHubController struct{}

func NewCustomerHubController() *CustomerHubController {
	return &CustomerHubController{}
}

func (ch *CustomerHubController) GetHubOverview(c *gin.Context) {
	customer, err := common.ResolveCustomerFromContext(c, true)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	var allOrders []order.Order
	config.DB.Preload("Tracking").Preload("Items").
		Where("customer_id = ?", customer.ID).
		Order("created_at DESC").Find(&allOrders)

	var activeOrders []order.Order
	var monthlySpendRp float64
	var monthlyUsageKg float64
	var kiloanKg float64
	var satuanKg float64
	var expressKg float64

	for _, ord := range allOrders {
		if ord.Status != order.StatusSelesai {
			activeOrders = append(activeOrders, ord)
		}
		monthlySpendRp += ord.TotalAmount
		monthlyUsageKg += ord.WeightKg

		switch ord.ServiceType {
		case "satuan":
			satuanKg += ord.WeightKg
		case "express":
			expressKg += ord.WeightKg
		default:
			kiloanKg += ord.WeightKg
		}
	}

	var claimedVouchersCount int64
	config.DB.Model(&voucherModel.CustomerVoucher{}).
		Where("customer_id = ? AND status = 'claimed'", customer.ID).
		Count(&claimedVouchersCount)

	response.Success(c, http.StatusOK, "Ringkasan portal pelanggan berhasil dimuat", gin.H{
		"customer":               customer,
		"active_orders":          activeOrders,
		"all_orders":             allOrders,
		"claimed_vouchers_count": claimedVouchersCount,
		"stats": gin.H{
			"remaining_quota_kg": customer.RemainingQuota,
			"monthly_spend_rp":   monthlySpendRp,
			"monthly_usage_kg":   monthlyUsageKg,
			"total_orders":       len(allOrders),
			"active_orders":      len(activeOrders),
			"loyalty_points":     customer.LoyaltyPoints,
			"total_saved_rp":     customer.TotalSavedRp,
			"composition": gin.H{
				"kiloan_kg":  kiloanKg,
				"satuan_kg":  satuanKg,
				"express_kg": expressKg,
			},
		},
	})
}
