package auth

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/middlewares/auth/jwt"
	"kucek-backend/models/auth/account"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/views/common/response"
	authView "kucek-backend/views/public/auth"

	"github.com/gin-gonic/gin"
)

type RegisterController struct{}

func NewRegisterController() *RegisterController {
	return &RegisterController{}
}

func (r *RegisterController) Register(c *gin.Context) {
	var req authView.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data registrasi tidak lengkap", err)
		return
	}

	var existingUser account.User
	if err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		response.BadRequest(c, "Email sudah terdaftar, silakan gunakan email lain atau login", nil)
		return
	}

	newUser := account.User{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Role:     account.RolePelanggan,
		IsActive: true,
	}

	if err := newUser.SetPassword(req.Password); err != nil {
		response.InternalError(c, "Gagal memproses kata sandi", err)
		return
	}

	tx := config.DB.Begin()

	if err := tx.Create(&newUser).Error; err != nil {
		tx.Rollback()
		response.InternalError(c, "Gagal mendaftarkan akun baru", err)
		return
	}

	customer := profile.Customer{
		UserID:  &newUser.ID,
		Name:    newUser.Name,
		Phone:   newUser.Phone,
		Address: req.Address,
	}
	if err := tx.Create(&customer).Error; err != nil {
		tx.Rollback()
		response.InternalError(c, "Gagal membuat profil pelanggan", err)
		return
	}

	tx.Commit()

	token, err := jwt.GenerateToken(&newUser)
	if err != nil {
		response.InternalError(c, "Gagal membuat sesi login", err)
		return
	}

	c.SetCookie("auth_token", token, 3600*config.AppConfig.JWTExpiryHours, "/", "", false, true)

	response.Success(c, http.StatusCreated, "Registrasi akun berhasil", authView.AuthResponse{
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

func (r *RegisterController) Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "Sesi tidak ditemukan")
		return
	}

	var user account.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		response.NotFound(c, "Pengguna tidak ditemukan")
		return
	}

	var customer *profile.Customer
	var cust profile.Customer
	if err := config.DB.Preload("Package").Where("user_id = ?", user.ID).First(&cust).Error; err == nil {
		customer = &cust
	}

	response.Success(c, http.StatusOK, "Profil pengguna berhasil dimuat", gin.H{
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
