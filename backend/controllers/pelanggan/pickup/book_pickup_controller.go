package pickup

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"kucek-backend/config"
	"kucek-backend/controllers/pelanggan/common"
	voucherCtrl "kucek-backend/controllers/pelanggan/voucher"
	voucherModel "kucek-backend/models/pelanggan/voucher"
	"kucek-backend/models/public/tracking"
	"kucek-backend/models/superadmin/order"
	serviceModel "kucek-backend/models/superadmin/service_catalog"
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

	customer, err := common.ResolveCustomerFromContext(c, false)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	now := time.Now()
	var totalOrders int64
	config.DB.Model(&order.Order{}).Count(&totalOrders)
	orderNumber := fmt.Sprintf("KCK-%d-%03d", now.Year(), totalOrders+1)

	serviceType := req.ServiceType
	if serviceType == "" {
		serviceType = "kiloan"
	}

	fragrance := req.Fragrance
	if fragrance == "" {
		fragrance = "ocean_fresh"
	}

	weightKg := req.WeightKg
	if weightKg <= 0 {
		weightKg = 3.0
	}

	// 1. Ambil tarif layanan secara dinamis dari tabel service_items
	var srvItem serviceModel.ServiceItem
	queryItem := "KILOAN-REG"
	if serviceType == "satuan" {
		queryItem = "BED-COVER"
	} else if serviceType == "express" {
		queryItem = "KILOAN-EXP"
	}

	pricePerKg := 8000.0
	if err := config.DB.Where("code = ? AND is_active = true", queryItem).First(&srvItem).Error; err == nil && srvItem.Price > 0 {
		pricePerKg = srvItem.Price
	} else {
		if serviceType == "satuan" {
			pricePerKg = 25000.0
		} else if serviceType == "express" {
			pricePerKg = 12000.0
		}
	}

	subtotal := weightKg * pricePerKg
	discount := 0.0
	appliedVoucherCode := ""
	quotaUsedKg := 0.0
	paymentStatus := order.PaymentUnpaid
	paymentMethod := "qris"

	// 1. Cek jika pelanggan memilih Potong Kuota Langganan
	if req.UseQuota && serviceType == "kiloan" && customer.RemainingQuota >= weightKg {
		customer.RemainingQuota -= weightKg
		quotaUsedKg = weightKg
		discount = subtotal
		paymentStatus = order.PaymentPaid
		paymentMethod = "kuota_langganan"
	} else if strings.TrimSpace(req.VoucherCode) != "" {
		// 2. Cek jika pelanggan menerapkan Kode Voucher
		code := strings.ToUpper(strings.TrimSpace(req.VoucherCode))
		var v voucherModel.Voucher
		if err := config.DB.Where("UPPER(code) = ?", code).First(&v).Error; err == nil {
			calcDisc, _, ok := voucherCtrl.CalculateVoucherDiscount(v, subtotal, weightKg, serviceType)
			if ok && calcDisc > 0 {
				discount = calcDisc
				appliedVoucherCode = v.Code

				// Tandai CustomerVoucher sebagai used
				var cv voucherModel.CustomerVoucher
				if errCV := config.DB.Where("customer_id = ? AND voucher_id = ? AND status = 'claimed'", customer.ID, v.ID).First(&cv).Error; errCV == nil {
					cv.Status = "used"
					cv.UsedAt = &now
					cv.UsedOrderNumber = orderNumber
					cv.SavedAmount = discount
					config.DB.Save(&cv)
				} else {
					// Jika belum klaim tapi langsung pakai kode di form
					cvNew := voucherModel.CustomerVoucher{
						CustomerID:      customer.ID,
						VoucherID:       v.ID,
						Status:          "used",
						ClaimedAt:       now,
						UsedAt:          &now,
						UsedOrderNumber: orderNumber,
						SavedAmount:     discount,
					}
					config.DB.Create(&cvNew)
				}

				v.UsedCount += 1
				config.DB.Save(&v)
				customer.TotalSavedRp += discount
			}
		}
	}

	totalAmount := subtotal - discount
	if totalAmount < 0 {
		totalAmount = 0
	}
	if totalAmount == 0 {
		paymentStatus = order.PaymentPaid
	}

	newOrder := order.Order{
		OrderNumber:   orderNumber,
		CustomerID:    customer.ID,
		ServiceType:   serviceType,
		WeightKg:      weightKg,
		Fragrance:     fragrance,
		PricePerKg:    pricePerKg,
		Subtotal:      subtotal,
		Discount:      discount,
		VoucherCode:   appliedVoucherCode,
		QuotaUsedKg:   quotaUsedKg,
		TotalAmount:   totalAmount,
		Status:        order.StatusMenungguJemput,
		PaymentStatus: paymentStatus,
		PaymentMethod: paymentMethod,
		Notes:         fmt.Sprintf("Jemput %s (%s) • %s", req.PickupDate, req.TimeSlot, req.Notes),
	}

	if err := config.DB.Create(&newOrder).Error; err != nil {
		response.InternalError(c, "Gagal membuat jadwal penjemputan", err)
		return
	}

	customer.TotalOrders += 1
	customer.LoyaltyPoints += 30
	if req.Address != "" {
		customer.Address = req.Address
	}
	config.DB.Save(&customer)

	initialLog := tracking.TrackingLog{
		OrderID:     newOrder.ID,
		OrderNumber: newOrder.OrderNumber,
		Status:      string(order.StatusMenungguJemput),
		Title:       "Permintaan Jemput Cucian Masuk",
		Description: fmt.Sprintf("Jadwal penjemputan terdaftar untuk %s (%s) di %s. Menunggu armada kurir ditugaskan oleh outlet.", req.PickupDate, req.TimeSlot, req.Address),
		Location:    req.Address,
		UpdatedBy:   customer.Name,
		Timestamp:   now,
	}
	config.DB.Create(&initialLog)

	response.Success(c, http.StatusCreated, "Penjemputan cucian berhasil dijadwalkan", gin.H{
		"order":              newOrder,
		"order_number":       newOrder.OrderNumber,
		"subtotal":           subtotal,
		"discount":           discount,
		"total_amount":       totalAmount,
		"voucher_code":       appliedVoucherCode,
		"quota_used_kg":      quotaUsedKg,
		"remaining_quota_kg": customer.RemainingQuota,
		"loyalty_points":     customer.LoyaltyPoints,
	})
}
