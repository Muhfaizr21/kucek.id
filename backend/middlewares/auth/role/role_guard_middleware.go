package role

import (
	"kucek-backend/models/auth/account"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

func RequireRoles(allowedRoles ...account.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("userRole")
		if !exists {
			response.Forbidden(c, "Izin role tidak ditemukan")
			c.Abort()
			return
		}

		userRole := roleVal.(account.Role)
		isAllowed := false
		for _, r := range allowedRoles {
			if userRole == r {
				isAllowed = true
				break
			}
		}

		// Superadmin selalu memiliki akses ke semua endpoint role
		if userRole == account.RoleSuperAdmin {
			isAllowed = true
		}

		if !isAllowed {
			response.Forbidden(c, "Hak akses role tidak mencukupi untuk modul ini")
			c.Abort()
			return
		}

		c.Next()
	}
}
