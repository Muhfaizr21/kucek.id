package subscription

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"kucek-backend/config"
	voucherCtrl "kucek-backend/controllers/pelanggan/voucher"
	"kucek-backend/models/pelanggan/profile"
	voucherModel "kucek-backend/models/pelanggan/voucher"
	"kucek-backend/models/superadmin/package_catalog"
	"kucek-backend/views/common/response"
	subView "kucek-backend/views/pelanggan/subscription"

	"github.com/gin-gonic/gin"
)

type BuyPackageController struct{}

func NewBuyPackageController() *BuyPackageController {
	return &BuyPackageController{}
}

func (b *BuyPackageController) Buy(c *gin.Context) {
	var req subView.BuyPackageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Paket yang dipilih tidak valid", err)
		return
	}

	userID, _ := c.Get("userID")

	var pkg package_catalog.LaundryPackage
	if err := config.DB.First(&pkg, req.PackageID).Error; err != nil {
		response.NotFound(c, "Paket langganan tidak ditemukan")
		return
	}

	var customer profile.Customer
	if err := config.DB.Where("user_id = ?", userID).First(&customer).Error; err != nil {
		if err2 := config.DB.Order("id ASC").First(&customer).Error; err2 != nil {
			response.NotFound(c, "Profil pelanggan tidak ditemukan")
			return
		}
	}

	now := time.Now()
	discount := 0.0
	appliedVoucher := ""

	if strings.TrimSpace(req.VoucherCode) != "" {
		code := strings.ToUpper(strings.TrimSpace(req.VoucherCode))
		var v voucherModel.Voucher
		if err := config.DB.Where("UPPER(code) = ?", code).First(&v).Error; err == nil {
			calcDisc, _, ok := voucherCtrl.CalculateVoucherDiscount(v, pkg.Price, pkg.QuotaKg, "paket")
			if ok && calcDisc > 0 {
				discount = calcDisc
				appliedVoucher = v.Code

				var cv voucherModel.CustomerVoucher
				if errCV := config.DB.Where("customer_id = ? AND voucher_id = ? AND status = 'claimed'", customer.ID, v.ID).First(&cv).Error; errCV == nil {
					cv.Status = "used"
					cv.UsedAt = &now
					cv.UsedOrderNumber = fmt.Sprintf("PKG-%s", pkg.Code)
					cv.SavedAmount = discount
					config.DB.Save(&cv)
				} else {
					cvNew := voucherModel.CustomerVoucher{
						CustomerID:      customer.ID,
						VoucherID:       v.ID,
						Status:          "used",
						ClaimedAt:       now,
						UsedAt:          &now,
						UsedOrderNumber: fmt.Sprintf("PKG-%s", pkg.Code),
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

	finalPaid := pkg.Price - discount
	if finalPaid < 0 {
		finalPaid = 0
	}

	expiry := now.AddDate(0, 0, pkg.ValidityDays)
	customer.PackageID = &pkg.ID
	customer.RemainingQuota += pkg.QuotaKg
	customer.PackageExpiryAt = &expiry
	customer.LoyaltyPoints += 100

	if err := config.DB.Save(&customer).Error; err != nil {
		response.InternalError(c, "Gagal memproses pembelian paket", err)
		return
	}

	response.Success(c, http.StatusOK, "Paket langganan berhasil diaktifkan", gin.H{
		"package":            pkg.Name,
		"added_quota_kg":     pkg.QuotaKg,
		"remaining_quota_kg": customer.RemainingQuota,
		"original_price":     pkg.Price,
		"discount":           discount,
		"final_paid":         finalPaid,
		"voucher_code":       appliedVoucher,
		"loyalty_points":     customer.LoyaltyPoints,
		"expiry_at":          customer.PackageExpiryAt,
	})
}
