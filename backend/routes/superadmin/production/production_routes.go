package production

import (
	prodCtrl "kucek-backend/controllers/superadmin/production"

	"github.com/gin-gonic/gin"
)

func RegisterProductionRoutes(rg *gin.RouterGroup) {
	ctrl := prodCtrl.NewKanbanController()
	rg.PATCH("/orders/:id/status", ctrl.UpdateStatus)
}
