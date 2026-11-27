package health

import (
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type HealthController struct{}

func NewHealthController() *HealthController {
	return &HealthController{}
}

func (h *HealthController) Check(c *gin.Context) {
	dbStatus := "healthy"
	sqlDB, err := config.DB.DB()
	if err != nil || sqlDB.Ping() != nil {
		dbStatus = "unreachable"
	}

	response.Success(c, http.StatusOK, "Kucek.id Backend API berjalan dengan normal", gin.H{
		"service":   "kucek-backend",
		"version":   "1.0.0",
		"env":       config.AppConfig.Env,
		"database":  dbStatus,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
