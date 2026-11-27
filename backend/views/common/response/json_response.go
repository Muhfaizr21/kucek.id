package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

func Success(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func Error(c *gin.Context, statusCode int, message string, err interface{}) {
	var errDetails interface{}
	if e, ok := err.(error); ok {
		errDetails = e.Error()
	} else {
		errDetails = err
	}

	c.JSON(statusCode, APIResponse{
		Success: false,
		Message: message,
		Error:   errDetails,
	})
}

func BadRequest(c *gin.Context, message string, err interface{}) {
	Error(c, http.StatusBadRequest, message, err)
}

func Unauthorized(c *gin.Context, message string) {
	Error(c, http.StatusUnauthorized, message, "Akses ditolak atau token tidak valid")
}

func Forbidden(c *gin.Context, message string) {
	Error(c, http.StatusForbidden, message, "Anda tidak memiliki izin untuk tindakan ini")
}

func NotFound(c *gin.Context, message string) {
	Error(c, http.StatusNotFound, message, "Data yang dicari tidak ditemukan")
}

func InternalError(c *gin.Context, message string, err interface{}) {
	Error(c, http.StatusInternalServerError, message, err)
}
