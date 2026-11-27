package jwt

import (
	"fmt"
	"strings"
	"time"

	"kucek-backend/config"
	"kucek-backend/models/auth/account"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
	golangJwt "github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	UserID  uint         `json:"user_id"`
	Email   string       `json:"email"`
	Role    account.Role `json:"role"`
	SubRole string       `json:"sub_role"`
	golangJwt.RegisteredClaims
}

func GenerateToken(user *account.User) (string, error) {
	expiry := time.Now().Add(time.Duration(config.AppConfig.JWTExpiryHours) * time.Hour)
	claims := JWTClaims{
		UserID:  user.ID,
		Email:   user.Email,
		Role:    user.Role,
		SubRole: user.SubRole,
		RegisteredClaims: golangJwt.RegisteredClaims{
			ExpiresAt: golangJwt.NewNumericDate(expiry),
			IssuedAt:  golangJwt.NewNumericDate(time.Now()),
			Issuer:    "kucek.id",
		},
	}

	token := golangJwt.NewWithClaims(golangJwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.AppConfig.JWTSecret))
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		tokenString := ""

		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			cookie, err := c.Cookie("auth_token")
			if err == nil && cookie != "" {
				tokenString = cookie
			}
		}

		if tokenString == "" {
			response.Unauthorized(c, "Token autentikasi diperlukan")
			c.Abort()
			return
		}

		claims := &JWTClaims{}
		token, err := golangJwt.ParseWithClaims(tokenString, claims, func(t *golangJwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*golangJwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("metode signing tidak valid: %v", t.Header["alg"])
			}
			return []byte(config.AppConfig.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			response.Unauthorized(c, "Sesi login kedaluwarsa atau token tidak valid")
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
