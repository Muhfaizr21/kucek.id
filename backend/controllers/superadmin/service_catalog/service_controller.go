package service_catalog

import (
	"fmt"
	"net/http"
	"strings"

	"kucek-backend/config"
	serviceModel "kucek-backend/models/superadmin/service_catalog"
	"kucek-backend/views/common/response"

	"github.com/gin-gonic/gin"
)

type ServiceCatalogController struct{}

func NewServiceCatalogController() *ServiceCatalogController {
	return &ServiceCatalogController{}
}

type SaveServiceRequest struct {
	Code           string  `json:"code"`
	Name           string  `json:"name" binding:"required"`
	Category       string  `json:"category" binding:"required"`
	Price          float64 `json:"price" binding:"required"`
	Unit           string  `json:"unit" binding:"required"`
	Description    string  `json:"description"`
	EstimatedHours int     `json:"estimated_hours"`
	IsActive       *bool   `json:"is_active"`
	SortOrder      int     `json:"sort_order"`
}

func (s *ServiceCatalogController) ListServices(c *gin.Context) {
	category := c.Query("category")
	activeOnly := c.Query("active_only")

	query := config.DB.Order("sort_order ASC, id ASC")
	if category != "" && category != "ALL" {
		query = query.Where("category = ?", category)
	}
	if activeOnly == "true" {
		query = query.Where("is_active = ?", true)
	}

	var items []serviceModel.ServiceItem
	if err := query.Find(&items).Error; err != nil {
		response.InternalError(c, "Gagal memuat katalog layanan & tarif", err)
		return
	}

	response.Success(c, http.StatusOK, "Katalog layanan & tarif berhasil dimuat", items)
}

func (s *ServiceCatalogController) CreateService(c *gin.Context) {
	var req SaveServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data layanan tidak lengkap", err)
		return
	}

	code := strings.ToUpper(strings.TrimSpace(req.Code))
	if code == "" {
		cleanName := strings.ToUpper(strings.ReplaceAll(req.Name, " ", "-"))
		if len(cleanName) > 16 {
			cleanName = cleanName[:16]
		}
		code = fmt.Sprintf("SRV-%s", cleanName)
	}

	estHours := req.EstimatedHours
	if estHours <= 0 {
		estHours = 48
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	item := serviceModel.ServiceItem{
		Code:           code,
		Name:           req.Name,
		Category:       strings.ToUpper(req.Category),
		Price:          req.Price,
		Unit:           req.Unit,
		Description:    req.Description,
		EstimatedHours: estHours,
		IsActive:       isActive,
		SortOrder:      req.SortOrder,
	}

	if err := config.DB.Create(&item).Error; err != nil {
		response.InternalError(c, "Gagal menambahkan layanan baru", err)
		return
	}

	response.Success(c, http.StatusCreated, "Layanan & tarif baru berhasil ditambahkan", item)
}

func (s *ServiceCatalogController) UpdateService(c *gin.Context) {
	id := c.Param("id")
	var item serviceModel.ServiceItem
	if err := config.DB.First(&item, id).Error; err != nil {
		response.NotFound(c, "Layanan tidak ditemukan")
		return
	}

	var req SaveServiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Data perubahan layanan tidak valid", err)
		return
	}

	if req.Code != "" {
		item.Code = strings.ToUpper(strings.TrimSpace(req.Code))
	}
	item.Name = req.Name
	item.Category = strings.ToUpper(req.Category)
	item.Price = req.Price
	item.Unit = req.Unit
	item.Description = req.Description
	if req.EstimatedHours > 0 {
		item.EstimatedHours = req.EstimatedHours
	}
	if req.IsActive != nil {
		item.IsActive = *req.IsActive
	}
	if req.SortOrder > 0 {
		item.SortOrder = req.SortOrder
	}

	if err := config.DB.Save(&item).Error; err != nil {
		response.InternalError(c, "Gagal memperbarui layanan & tarif", err)
		return
	}

	response.Success(c, http.StatusOK, "Tarif & detail layanan berhasil diperbarui", item)
}

func (s *ServiceCatalogController) DeleteService(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&serviceModel.ServiceItem{}, id).Error; err != nil {
		response.InternalError(c, "Gagal menghapus item layanan", err)
		return
	}
	response.Success(c, http.StatusOK, "Item layanan berhasil dihapus", gin.H{"deleted_id": id})
}
