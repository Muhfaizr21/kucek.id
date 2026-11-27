package staff

import (
	staffCtrl "kucek-backend/controllers/superadmin/staff"

	"github.com/gin-gonic/gin"
)

func RegisterStaffRoutes(rg *gin.RouterGroup) {
	ctrl := staffCtrl.NewStaffController()
	rg.GET("/staff", ctrl.ListStaff)
	rg.POST("/staff", ctrl.CreateStaff)
	rg.PUT("/staff/:id", ctrl.UpdateStaff)
	rg.DELETE("/staff/:id", ctrl.DeleteStaff)
}
