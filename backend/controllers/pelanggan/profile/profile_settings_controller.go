package profile

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/auth/account"
	custModel "kucek-backend/models/pelanggan/profile"
	"kucek-backend/views/common/response"
	profileView "kucek-backend/views/pelanggan/profile"

	"github.com/gin-gonic/gin"
)

type ProfileSettingsController struct{}

func NewProfileSettingsController() *ProfileSettingsController {
	return &ProfileSettingsController{}
}

func (p *ProfileSettingsController) UpdateProfile(c *gin.Context) {
	var req profileView.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data profil yang dikirim belum lengkap", err)
		return
	}

	userID, _ := c.Get("userID")

	var user account.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		response.NotFound(c, "Akun pengguna tidak ditemukan")
		return
	}

	user.Name = req.Name
	user.Phone = req.Phone
	if err := config.DB.Save(&user).Error; err != nil {
		response.InternalError(c, "Gagal memperbarui akun pengguna", err)
		return
	}

	var customer custModel.Customer
	if err := config.DB.Where("user_id = ?", user.ID).First(&customer).Error; err == nil {
		customer.Name = req.Name
		customer.Phone = req.Phone
		if req.Address != "" {
			customer.Address = req.Address
		}
		if req.Area != "" {
			customer.Area = req.Area
		}
		config.DB.Save(&customer)
	}

	response.Success(c, http.StatusOK, "Profil pelanggan berhasil diperbarui", gin.H{
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

func (p *ProfileSettingsController) ChangePassword(c *gin.Context) {
	var req profileView.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Format kata sandi tidak valid (minimal 4 karakter)", err)
		return
	}

	userID, _ := c.Get("userID")

	var user account.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		response.NotFound(c, "Pengguna tidak ditemukan")
		return
	}

	if !user.CheckPassword(req.CurrentPassword) {
		response.BadRequest(c, "Kata sandi saat ini tidak sesuai", nil)
		return
	}

	if err := user.SetPassword(req.NewPassword); err != nil {
		response.InternalError(c, "Gagal mengenkripsi kata sandi baru", err)
		return
	}

	if err := config.DB.Save(&user).Error; err != nil {
		response.InternalError(c, "Gagal menyimpan kata sandi baru", err)
		return
	}

	response.Success(c, http.StatusOK, "Kata sandi berhasil diperbarui", nil)
}
