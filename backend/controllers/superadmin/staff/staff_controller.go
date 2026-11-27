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

func (s *StaffController) ListStaff(c *gin.Context) {
	var users []account.User
	if err := config.DB.Where("role != ?", account.RolePelanggan).Order("id ASC").Find(&users).Error; err != nil {
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
		response.InternalError(c, "Gagal menambahkan akun staf", err)
		return
	}
	response.Success(c, http.StatusCreated, "Akun staf berhasil dibuat", newStaff)
}
