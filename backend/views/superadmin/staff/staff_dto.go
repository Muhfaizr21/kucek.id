package staff

type CreateStaffRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required"`
	SubRole  string `json:"sub_role"`
}
