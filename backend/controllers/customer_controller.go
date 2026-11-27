package controllers

import (
	"net/http"

	"kucek-backend/config"
	"kucek-backend/models"
	"kucek-backend/views"

	"github.com/gin-gonic/gin"
)

type CustomerController struct{}

func NewCustomerController() *CustomerController {
	return &CustomerController{}
}

func (cc *CustomerController) List(c *gin.Context) {
	var customers []models.Customer
	if err := config.DB.Preload("Package").Order("created_at DESC").Find(&customers).Error; err != nil {
		views.InternalError(c, "Gagal mengambil data pelanggan", err)
		return
	}
	views.Success(c, http.StatusOK, "Daftar pelanggan berhasil dimuat", customers)
}

func (cc *CustomerController) GetByID(c *gin.Context) {
	id := c.Param("id")
	var customer models.Customer
	if err := config.DB.Preload("Package").First(&customer, id).Error; err != nil {
		views.NotFound(c, "Pelanggan tidak ditemukan")
		return
	}
	views.Success(c, http.StatusOK, "Data pelanggan berhasil dimuat", customer)
}
