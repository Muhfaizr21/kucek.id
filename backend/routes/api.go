package routes

import (
	"kucek-backend/controllers"
	"kucek-backend/middlewares"
	"kucek-backend/models"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()

	// Global Middlewares
	r.Use(gin.Recovery())
	r.Use(middlewares.RequestLogger())
	r.Use(middlewares.CORSMiddleware())

	// Controller Instances
	healthCtrl := controllers.NewHealthController()
	authCtrl := controllers.NewAuthController()
	orderCtrl := controllers.NewOrderController()
	customerCtrl := controllers.NewCustomerController()
	packageCtrl := controllers.NewPackageController()
	trackingCtrl := controllers.NewTrackingController()
	statsCtrl := controllers.NewStatsController()

	apiV1 := r.Group("/api/v1")
	{
		// 1. Public Endpoints
		apiV1.GET("/health", healthCtrl.Check)
		apiV1.GET("/track/:order_number", trackingCtrl.TrackOrder)
		apiV1.GET("/packages", packageCtrl.List)

		// Auth Public
		authGroup := apiV1.Group("/auth")
		{
			authGroup.POST("/login", authCtrl.Login)
			authGroup.POST("/register", authCtrl.Register)
		}

		// 2. Authenticated Endpoints
		authProtected := apiV1.Group("")
		authProtected.Use(middlewares.AuthMiddleware())
		{
			authProtected.GET("/auth/me", authCtrl.Me)
			authProtected.POST("/auth/logout", authCtrl.Logout)

			// Customer endpoints
			authProtected.POST("/customer/buy-package", packageCtrl.Buy)

			// 3. Superadmin & Internal Staf Endpoints
			adminGroup := authProtected.Group("")
			adminGroup.Use(middlewares.RequireRoles(models.RoleSuperAdmin, models.RoleKasir, models.RoleOperator))
			{
				// Order Management & POS
				adminGroup.GET("/orders", orderCtrl.ListOrders)
				adminGroup.POST("/orders", orderCtrl.CreateOrder)
				adminGroup.GET("/orders/:id", orderCtrl.GetOrderByID)
				adminGroup.PATCH("/orders/:id/status", orderCtrl.UpdateStatus)
				adminGroup.PATCH("/orders/:id/payment", orderCtrl.UpdatePayment)

				// Customer Directory
				adminGroup.GET("/customers", customerCtrl.List)
				adminGroup.GET("/customers/:id", customerCtrl.GetByID)

				// Dashboard KPI
				adminGroup.GET("/stats/dashboard", statsCtrl.GetDashboardStats)
			}
		}
	}

	return r
}
