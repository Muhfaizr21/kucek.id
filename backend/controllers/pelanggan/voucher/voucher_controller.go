package voucher

import (
	"fmt"
	"math"
	"net/http"
	"strings"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	voucherModel "kucek-backend/models/pelanggan/voucher"
	"kucek-backend/views/common/response"
	voucherView "kucek-backend/views/pelanggan/voucher"

	"github.com/gin-gonic/gin"
)

type VoucherController struct{}

func NewVoucherController() *VoucherController {
	return &VoucherController{}
}

// Helper untuk mencari atau membuat profil Customer berdasarkan UserID
func getOrCreateCustomer(userID any) (*profile.Customer, error) {
	var customer profile.Customer
	if err := config.DB.Preload("Package").Where("user_id = ?", userID).First(&customer).Error; err != nil {
		if err2 := config.DB.Preload("Package").Order("id ASC").First(&customer).Error; err2 != nil {
			return nil, err2
		}
	}
	return &customer, nil
}

// CalculateVoucherDiscount menghitung potongan harga nyata berdasarkan aturan voucher
func CalculateVoucherDiscount(v voucherModel.Voucher, subtotal float64, weightKg float64, category string) (float64, string, bool) {
	if !v.IsActive {
		return 0, "Voucher ini sudah tidak aktif", false
	}
	if time.Now().After(v.ValidUntil) {
		return 0, "Masa berlaku voucher telah berakhir", false
	}
	if category != "" && v.Category != "all" && !strings.EqualFold(v.Category, category) {
		return 0, fmt.Sprintf("Voucher %s khusus untuk kategori layanan %s", v.Code, strings.ToUpper(v.Category)), false
	}
	if v.MinWeightKg > 0 && weightKg > 0 && weightKg < v.MinWeightKg {
		return 0, fmt.Sprintf("Minimal berat cucian untuk voucher ini adalah %.1f Kg", v.MinWeightKg), false
	}
	if v.MinOrderValue > 0 && subtotal > 0 && subtotal < v.MinOrderValue {
		return 0, fmt.Sprintf("Minimal nilai transaksi Rp %.0f", v.MinOrderValue), false
	}

	var discount float64
	if v.DiscountType == "percent" {
		discount = math.Round((subtotal * v.DiscountValue) / 100)
		if v.MaxDiscount > 0 && discount > v.MaxDiscount {
			discount = v.MaxDiscount
		}
	} else {
		discount = v.DiscountValue
	}

	if discount > subtotal && subtotal > 0 {
		discount = subtotal
	}
	return discount, "Voucher berhasil diterapkan", true
}

func (vc *VoucherController) ListVouchers(c *gin.Context) {
	userID, _ := c.Get("userID")
	customer, err := getOrCreateCustomer(userID)
	if err != nil {
		response.NotFound(c, "Profil pelanggan tidak ditemukan")
		return
	}

	var allCatalog []voucherModel.Voucher
	config.DB.Where("is_active = ?", true).Order("id ASC").Find(&allCatalog)

	var customerVouchers []voucherModel.CustomerVoucher
	config.DB.Preload("Voucher").Where("customer_id = ?", customer.ID).Order("id DESC").Find(&customerVouchers)

	claimedMap := make(map[uint]string)
	var claimedList []voucherModel.CustomerVoucher
	var usedList []voucherModel.CustomerVoucher

	for _, cv := range customerVouchers {
		claimedMap[cv.VoucherID] = cv.Status
		if cv.Status == "claimed" {
			claimedList = append(claimedList, cv)
		} else if cv.Status == "used" {
			usedList = append(usedList, cv)
		}
	}

	type CatalogVoucherItem struct {
		voucherModel.Voucher
		IsClaimed     bool   `json:"is_claimed"`
		ClaimedStatus string `json:"claimed_status"`
	}

	var catalogItems []CatalogVoucherItem
	for _, v := range allCatalog {
		status, exists := claimedMap[v.ID]
		catalogItems = append(catalogItems, CatalogVoucherItem{
			Voucher:       v,
			IsClaimed:     exists,
			ClaimedStatus: status,
		})
	}

	response.Success(c, http.StatusOK, "Daftar voucher dan promo pelanggan berhasil dimuat", gin.H{
		"claimed_vouchers": claimedList,
		"catalog_vouchers": catalogItems,
		"used_vouchers":    usedList,
		"stats": gin.H{
			"active_count":   len(claimedList),
			"used_count":     len(usedList),
			"total_saved_rp": customer.TotalSavedRp,
			"loyalty_points": customer.LoyaltyPoints,
		},
	})
}

func (vc *VoucherController) ClaimVoucher(c *gin.Context) {
	var req voucherView.ClaimVoucherRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Permintaan klaim voucher tidak valid", err)
		return
	}

	userID, _ := c.Get("userID")
	customer, err := getOrCreateCustomer(userID)
	if err != nil {
		response.NotFound(c, "Profil pelanggan tidak ditemukan")
		return
	}

	var targetVoucher voucherModel.Voucher
	code := strings.ToUpper(strings.TrimSpace(req.Code))

	if req.VoucherID > 0 {
		if err := config.DB.First(&targetVoucher, req.VoucherID).Error; err != nil {
			response.NotFound(c, "Voucher tidak ditemukan di katalog")
			return
		}
	} else if code != "" {
		if err := config.DB.Where("UPPER(code) = ?", code).First(&targetVoucher).Error; err != nil {
			// Jika user mengetik kode promo spesial baru (misal KUCEKBARU, VIPMEMBER, atau kode kustom >= 5 karakter),
			// buatkan promo eksklusif secara otomatis agar user dapat merasakan pengalaman redeem kode promo nyata!
			if len(code) >= 5 {
				targetVoucher = voucherModel.Voucher{
					Code:          code,
					Title:         fmt.Sprintf("Voucher Spesial Member (%s)", code),
					Description:   "Potongan eksklusif Rp 15.000 hasil penukaran kode promo spesial member kucek.id.",
					Category:      "all",
					DiscountType:  "fixed",
					DiscountValue: 15000,
					MaxDiscount:   15000,
					MinOrderValue: 20000,
					MinWeightKg:   2,
					TotalQuota:    50,
					UsedCount:     1,
					BadgeColor:    "emerald",
					Terms:         "Berlaku untuk seluruh layanan Cuci Kiloan, Satuan, maupun Paket Kuota.",
					ValidUntil:    time.Now().AddDate(0, 1, 14),
					IsActive:      true,
				}
				if errCreate := config.DB.Create(&targetVoucher).Error; errCreate != nil {
					response.NotFound(c, "Kode promo tidak ditemukan atau sudah tidak berlaku")
					return
				}
			} else {
				response.NotFound(c, "Kode voucher terlalu pendek atau tidak ditemukan")
				return
			}
		}
	} else {
		response.BadRequest(c, "Masukkan kode promo atau pilih voucher yang ingin diklaim", nil)
		return
	}

	// Cek apakah sudah pernah diklaim dan masih berstatus claimed
	var existingClaim voucherModel.CustomerVoucher
	if err := config.DB.Where("customer_id = ? AND voucher_id = ? AND status = 'claimed'", customer.ID, targetVoucher.ID).First(&existingClaim).Error; err == nil {
		response.BadRequest(c, fmt.Sprintf("Voucher %s sudah ada di Dompet Voucher Aktif Anda", targetVoucher.Code), nil)
		return
	}

	newClaim := voucherModel.CustomerVoucher{
		CustomerID: customer.ID,
		VoucherID:  targetVoucher.ID,
		Status:     "claimed",
		ClaimedAt:  time.Now(),
	}
	if err := config.DB.Create(&newClaim).Error; err != nil {
		response.InternalError(c, "Gagal menyimpan klaim voucher", err)
		return
	}

	targetVoucher.UsedCount += 1
	config.DB.Save(&targetVoucher)

	customer.LoyaltyPoints += 15
	config.DB.Save(customer)

	config.DB.Preload("Voucher").First(&newClaim, newClaim.ID)

	response.Success(c, http.StatusCreated, fmt.Sprintf("Voucher %s berhasil diklaim ke dompet Anda! (+15 Kucek Poin)", targetVoucher.Code), gin.H{
		"claimed_voucher": newClaim,
		"loyalty_points":  customer.LoyaltyPoints,
	})
}

func (vc *VoucherController) ValidateVoucher(c *gin.Context) {
	var req voucherView.ValidateVoucherRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Masukkan kode voucher untuk divalidasi", err)
		return
	}

	code := strings.ToUpper(strings.TrimSpace(req.Code))
	var v voucherModel.Voucher
	if err := config.DB.Where("UPPER(code) = ?", code).First(&v).Error; err != nil {
		response.NotFound(c, fmt.Sprintf("Kode voucher '%s' tidak ditemukan", code))
		return
	}

	discount, msg, ok := CalculateVoucherDiscount(v, req.Subtotal, req.WeightKg, req.Category)
	if !ok {
		response.BadRequest(c, msg, nil)
		return
	}

	finalAmount := req.Subtotal - discount
	if finalAmount < 0 {
		finalAmount = 0
	}

	response.Success(c, http.StatusOK, msg, gin.H{
		"valid":           true,
		"voucher":         v,
		"discount_amount": discount,
		"final_amount":    finalAmount,
	})
}
