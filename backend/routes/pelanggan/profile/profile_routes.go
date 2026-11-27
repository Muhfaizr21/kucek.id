package profile

import (
	profileCtrl "kucek-backend/controllers/pelanggan/profile"

	"github.com/gin-gonic/gin"
)

func RegisterCustomerProfileRoutes(rg *gin.RouterGroup) {
	ctrl := profileCtrl.NewProfileSettingsController()
	rg.PUT("/customer/profile", ctrl.UpdateProfile)
	rg.PUT("/customer/password", ctrl.ChangePassword)
}
