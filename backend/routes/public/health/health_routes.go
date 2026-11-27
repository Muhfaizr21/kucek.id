package health

import (
	healthCtrl "kucek-backend/controllers/public/health"

	"github.com/gin-gonic/gin"
)

func RegisterHealthRoutes(rg *gin.RouterGroup) {
	ctrl := healthCtrl.NewHealthController()
	rg.GET("/health", ctrl.Check)
}
