package middlewares

import (
	"fmt"
	"strings"
	"time"

	"kucek-backend/config"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	UserID  uint        `json:"user_id"`
	Email   string      `json:"email"`
	Role    models.Role `json:"role"`
	SubRole string      `json:"sub_role"`
	jwt.RegisteredClaims
}

func GenerateToken(user *models.User) (string, error) {
	expiry := time.Now().Add(time.Duration(config.AppConfig.JWTExpiryHours) * time.Hour)
	claims := JWTClaims{
		UserID:  user.ID,
		Email:   user.Email,
		Role:    user.Role,
		SubRole: user.SubRole,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiry),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "kucek.id",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.AppConfig.JWTSecret))
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		tokenString := ""

		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			// Cek HttpOnly cookie jika header tidak ada
			cookie, err := c.Cookie("auth_token")
			if err == nil && cookie != "" {
				tokenString = cookie
			}
		}

		if tokenString == "" {
			views.Unauthorized(c, "Token autentikasi diperlukan")
			c.Abort()
			return
		}

		claims := &JWTClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("metode signing tidak valid: %v", t.Header["alg"])
			}
			return []byte(config.AppConfig.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			views.Unauthorized(c, "Sesi login kedaluwarsa atau token tidak valid")
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", claims.Role)
		c.Set("userSubRole", claims.SubRole)

		c.Next()
	}
}

func RequireRoles(allowedRoles ...models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("userRole")
		if !exists {
			views.Forbidden(c, "Izin role tidak ditemukan")
			c.Abort()
			return
		}

		userRole := roleVal.(models.Role)
		isAllowed := false
		for _, r := range allowedRoles {
			if userRole == r {
				isAllowed = true
				break
			}
		}

		// Superadmin selalu memiliki akses ke semua endpoint role
		if userRole == models.RoleSuperAdmin {
			isAllowed = true
		}

		if !isAllowed {
			views.Forbidden(c, "Hak akses role tidak mencukupi untuk modul ini")
			c.Abort()
			return
		}

		c.Next()
	}
}
