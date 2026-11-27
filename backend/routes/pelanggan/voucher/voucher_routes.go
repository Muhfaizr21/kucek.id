package voucher

import (
	voucherCtrl "kucek-backend/controllers/pelanggan/voucher"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerVoucherRoutes(rg *gin.RouterGroup) {
	ctrl := voucherCtrl.NewVoucherController()
	customer := rg.Group("/customer")
	{
		customer.GET("/vouchers", ctrl.ListVouchers)
		customer.POST("/vouchers/claim", ctrl.ClaimVoucher)
		customer.POST("/vouchers/validate", ctrl.ValidateVoucher)
	}
}
