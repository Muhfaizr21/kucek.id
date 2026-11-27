package tracking

import (
	trackingCtrl "kucek-backend/controllers/public/tracking"

	"github.com/gin-gonic/gin"
)

func RegisterTrackingRoutes(rg *gin.RouterGroup) {
	ctrl := trackingCtrl.NewTrackingController()
	rg.GET("/track/:order_number", ctrl.TrackOrder)
}
