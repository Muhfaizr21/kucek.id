package dispatch

import (
	dispatchCtrl "kucek-backend/controllers/superadmin/dispatch"

	"github.com/gin-gonic/gin"
)

func RegisterDispatchRoutes(rg *gin.RouterGroup) {
	ctrl := dispatchCtrl.NewDispatchController()
	rg.GET("/dispatch/pickups", ctrl.ListPickupDeliveries)
	rg.PATCH("/dispatch/pickups/:id/assign", ctrl.AssignCourier)
}
