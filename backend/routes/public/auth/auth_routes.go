package auth

import (
	authCtrl "kucek-backend/controllers/public/auth"

	"github.com/gin-gonic/gin"
)

func RegisterPublicAuthRoutes(rg *gin.RouterGroup) {
	loginController := authCtrl.NewLoginController()
	registerController := authCtrl.NewRegisterController()

	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/login", loginController.Login)
		authGroup.POST("/register", registerController.Register)
	}
}

func RegisterProtectedAuthRoutes(rg *gin.RouterGroup) {
	loginController := authCtrl.NewLoginController()
	registerController := authCtrl.NewRegisterController()

	rg.GET("/auth/me", registerController.Me)
	rg.POST("/auth/logout", loginController.Logout)
}
