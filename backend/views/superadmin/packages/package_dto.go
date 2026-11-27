package packages

type SavePackageRequest struct {
	Code         string  `json:"code" binding:"required"`
	Name         string  `json:"name" binding:"required"`
	Description  string  `json:"description"`
	Price        float64 `json:"price" binding:"required"`
	QuotaKg      float64 `json:"quota_kg" binding:"required"`
	ValidityDays int     `json:"validity_days" binding:"required"`
	Features     string  `json:"features"`
	IsPopular    bool    `json:"is_popular"`
}
