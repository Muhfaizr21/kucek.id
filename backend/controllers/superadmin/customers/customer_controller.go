package customers

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models/pelanggan/profile"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type CustomerController struct{}

func NewCustomerController() *CustomerController {
	return &CustomerController{}
}

func (cc *CustomerController) List(c *gin.Context) {
	var customers []profile.Customer
	if err := config.DB.Preload("Package").Order("created_at DESC").Find(&customers).Error; err != nil {
		response.InternalError(c, "Gagal mengambil data pelanggan", err)
		return
	}
	response.Success(c, http.StatusOK, "Daftar pelanggan berhasil dimuat", customers)
}

func (cc *CustomerController) GetByID(c *gin.Context) {
	id := c.Param("id")
	var customer profile.Customer
	if err := config.DB.Preload("Package").First(&customer, id).Error; err != nil {
		response.NotFound(c, "Pelanggan tidak ditemukan")
		return
	}
	response.Success(c, http.StatusOK, "Data pelanggan berhasil dimuat", customer)
}
