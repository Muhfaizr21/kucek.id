package cors

import (
	"net/http"
	"strings"

	"kucek-backend/config"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowedOrigins := strings.Split(config.AppConfig.CORSAllowedOrigins, ",")

		allowOrigin := ""
		for _, o := range allowedOrigins {
			if strings.TrimSpace(o) == origin {
				allowOrigin = origin
				break
			}
		}

		if allowOrigin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", allowOrigin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		} else if len(allowedOrigins) > 0 && allowedOrigins[0] != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", strings.TrimSpace(allowedOrigins[0]))
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
