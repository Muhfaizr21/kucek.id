package auth

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/middlewares/auth/jwt"
	"kucek-backend/models/auth/account"
	"kucek-backend/views/common/response"
	authView "kucek-backend/views/public/auth"

	"github.com/gin-gonic/gin"
)

type LoginController struct{}

func NewLoginController() *LoginController {
	return &LoginController{}
}

func (l *LoginController) Login(c *gin.Context) {
	var req authView.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Format data login tidak valid", err)
		return
	}

	var user account.User
	if err := config.DB.Where("email = ? AND is_active = true", req.Email).First(&user).Error; err != nil {
		response.Unauthorized(c, "Email atau kata sandi tidak sesuai")
		return
	}

	if !user.CheckPassword(req.Password) {
		response.Unauthorized(c, "Email atau kata sandi tidak sesuai")
		return
	}

	token, err := jwt.GenerateToken(&user)
	if err != nil {
		response.InternalError(c, "Gagal membuat token autentikasi", err)
		return
	}

	c.SetCookie("auth_token", token, 3600*config.AppConfig.JWTExpiryHours, "/", "", false, true)

	response.Success(c, http.StatusOK, "Login berhasil", authView.AuthResponse{
		Token: token,
		User: gin.H{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"phone":     user.Phone,
			"role":      user.Role,
			"sub_role":  user.SubRole,
			"is_active": user.IsActive,
		},
	})
}

func (l *LoginController) Logout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	response.Success(c, http.StatusOK, "Berhasil keluar dari sesi", nil)
}
