package staff

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/auth/account"
	"kucek-backend/views/common/response"
	staffView "kucek-backend/views/superadmin/staff"

	"github.com/gin-gonic/gin"
)

type StaffController struct{}

func NewStaffController() *StaffController {
	return &StaffController{}
}

type UpdateStaffRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email"`
	Phone    string `json:"phone" binding:"required"`
	Role     string `json:"role" binding:"required"`
	SubRole  string `json:"sub_role"`
	IsActive *bool  `json:"is_active"`
	Password string `json:"password"`
}

func (s *StaffController) ListStaff(c *gin.Context) {
	var users []account.User
	if err := config.DB.Where("role IN ?", []account.Role{
		account.RoleSuperAdmin,
		account.RoleKasir,
		account.RoleOperator,
		account.RoleKurir,
	}).Order("created_at ASC").Find(&users).Error; err != nil {
		response.InternalError(c, "Gagal memuat daftar staf internal", err)
		return
	}
	response.Success(c, http.StatusOK, "Daftar staf berhasil dimuat", users)
}

func (s *StaffController) CreateStaff(c *gin.Context) {
	var req staffView.CreateStaffRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data staf tidak valid", err)
		return
	}

	newStaff := account.User{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Role:     account.Role(req.Role),
		SubRole:  req.SubRole,
		IsActive: true,
	}
	if err := newStaff.SetPassword(req.Password); err != nil {
		response.InternalError(c, "Gagal memproses kata sandi staf", err)
		return
	}

	if err := config.DB.Create(&newStaff).Error; err != nil {
		response.InternalError(c, "Gagal menambahkan akun staf (email/telepon mungkin sudah dipakai)", err)
		return
	}
	response.Success(c, http.StatusCreated, "Akun staf berhasil dibuat", newStaff)
}

func (s *StaffController) UpdateStaff(c *gin.Context) {
	id := c.Param("id")
	var staffUser account.User
	if err := config.DB.First(&staffUser, id).Error; err != nil {
		response.NotFound(c, "Staf tidak ditemukan")
		return
	}

	var req UpdateStaffRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data perubahan staf tidak valid", err)
		return
	}

	staffUser.Name = req.Name
	if req.Email != "" {
		staffUser.Email = req.Email
	}
	staffUser.Phone = req.Phone
	staffUser.Role = account.Role(req.Role)
	staffUser.SubRole = req.SubRole
	if req.IsActive != nil {
		staffUser.IsActive = *req.IsActive
	}
	if len(req.Password) >= 6 {
		_ = staffUser.SetPassword(req.Password)
	}

	if err := config.DB.Save(&staffUser).Error; err != nil {
		response.InternalError(c, "Gagal memperbarui data staf", err)
		return
	}

	response.Success(c, http.StatusOK, "Data staf berhasil diperbarui", staffUser)
}

func (s *StaffController) DeleteStaff(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&account.User{}, id).Error; err != nil {
		response.InternalError(c, "Gagal menghapus akun staf", err)
		return
	}
	response.Success(c, http.StatusOK, "Akun staf berhasil dihapus", gin.H{"deleted_id": id})
}
