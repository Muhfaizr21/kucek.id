package controllers

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/middlewares"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
)

type AuthController struct{}

func NewAuthController() *AuthController {
	return &AuthController{}
}

func (a *AuthController) Login(c *gin.Context) {
	var req views.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		views.BadRequest(c, "Format data login tidak valid", err)
		return
	}

	var user models.User
	if err := config.DB.Where("email = ? AND is_active = true", req.Email).First(&user).Error; err != nil {
		views.Unauthorized(c, "Email atau kata sandi tidak sesuai")
		return
	}

	if !user.CheckPassword(req.Password) {
		views.Unauthorized(c, "Email atau kata sandi tidak sesuai")
		return
	}

	token, err := middlewares.GenerateToken(&user)
	if err != nil {
		views.InternalError(c, "Gagal membuat token autentikasi", err)
		return
	}

	// Set HttpOnly Cookie untuk keamanan ekstra
	c.SetCookie("auth_token", token, 3600*config.AppConfig.JWTExpiryHours, "/", "", false, true)

	views.Success(c, http.StatusOK, "Login berhasil", views.AuthResponse{
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

func (a *AuthController) Register(c *gin.Context) {
	var req views.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		views.BadRequest(c, "Data registrasi tidak lengkap", err)
		return
	}

	// Cek apakah email sudah terdaftar
	var existingUser models.User
	if err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		views.BadRequest(c, "Email sudah terdaftar, silakan gunakan email lain atau login", nil)
		return
	}

	newUser := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Role:     models.RolePelanggan,
		IsActive: true,
	}

	if err := newUser.SetPassword(req.Password); err != nil {
		views.InternalError(c, "Gagal memproses kata sandi", err)
		return
	}

	tx := config.DB.Begin()

	if err := tx.Create(&newUser).Error; err != nil {
		tx.Rollback()
		views.InternalError(c, "Gagal mendaftarkan akun baru", err)
		return
	}

	// Buat profil customer otomatis
	customer := models.Customer{
		UserID:  &newUser.ID,
		Name:    newUser.Name,
		Phone:   newUser.Phone,
		Address: req.Address,
	}
	if err := tx.Create(&customer).Error; err != nil {
		tx.Rollback()
		views.InternalError(c, "Gagal membuat profil pelanggan", err)
		return
	}

	tx.Commit()

	token, err := middlewares.GenerateToken(&newUser)
	if err != nil {
		views.InternalError(c, "Gagal membuat sesi login", err)
		return
	}

	// Set HttpOnly Cookie saat registrasi agar langsung login
	c.SetCookie("auth_token", token, 3600*config.AppConfig.JWTExpiryHours, "/", "", false, true)

	views.Success(c, http.StatusCreated, "Registrasi akun berhasil", views.AuthResponse{
		Token: token,
		User: gin.H{
			"id":          newUser.ID,
			"name":        newUser.Name,
			"email":       newUser.Email,
			"phone":       newUser.Phone,
			"role":        newUser.Role,
			"customer_id": customer.ID,
		},
	})
}

func (a *AuthController) Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		views.Unauthorized(c, "Sesi tidak ditemukan")
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		views.NotFound(c, "Pengguna tidak ditemukan")
		return
	}

	var customer *models.Customer
	var cust models.Customer
	if err := config.DB.Preload("Package").Where("user_id = ?", user.ID).First(&cust).Error; err == nil {
		customer = &cust
	}

	views.Success(c, http.StatusOK, "Profil pengguna berhasil dimuat", gin.H{
		"user": gin.H{
			"id":        user.ID,
			"name":      user.Name,
			"email":     user.Email,
			"phone":     user.Phone,
			"role":      user.Role,
			"sub_role":  user.SubRole,
			"is_active": user.IsActive,
		},
		"customer": customer,
	})
}

func (a *AuthController) Logout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	views.Success(c, http.StatusOK, "Berhasil keluar dari sesi", nil)
}
