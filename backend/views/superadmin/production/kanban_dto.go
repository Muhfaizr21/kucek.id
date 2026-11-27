package production

type UpdateStatusRequest struct {
	Status      string `json:"status" binding:"required"`
	Description string `json:"description"`
	Location    string `json:"location"`
}
