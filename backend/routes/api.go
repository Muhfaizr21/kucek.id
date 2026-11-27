package routes

import (
	"kucek-backend/middlewares/auth/jwt"
	"kucek-backend/middlewares/auth/role"
	"kucek-backend/middlewares/common/cors"
	"kucek-backend/middlewares/common/logger"
	"kucek-backend/models/auth/account"

	// Public Routes by Feature
	publicAuthRoutes "kucek-backend/routes/public/auth"
	publicCatalogRoutes "kucek-backend/routes/public/catalog"
	publicHealthRoutes "kucek-backend/routes/public/health"
	publicTrackingRoutes "kucek-backend/routes/public/tracking"

	// Pelanggan Routes by Feature
	pelangganHubRoutes "kucek-backend/routes/pelanggan/dashboard"
	pelangganHistoryRoutes "kucek-backend/routes/pelanggan/history"
	pelangganPickupRoutes "kucek-backend/routes/pelanggan/pickup"
	pelangganProfileRoutes "kucek-backend/routes/pelanggan/profile"
	pelangganSubRoutes "kucek-backend/routes/pelanggan/subscription"
	pelangganVoucherRoutes "kucek-backend/routes/pelanggan/voucher"

	// Superadmin Routes by Feature
	superadminCustomerRoutes "kucek-backend/routes/superadmin/customers"
	superadminDashboardRoutes "kucek-backend/routes/superadmin/dashboard"
	superadminDispatchRoutes "kucek-backend/routes/superadmin/dispatch"
	superadminFinanceRoutes "kucek-backend/routes/superadmin/finance"
	superadminPackageRoutes "kucek-backend/routes/superadmin/packages"
	superadminPosRoutes "kucek-backend/routes/superadmin/pos"
	superadminProductionRoutes "kucek-backend/routes/superadmin/production"
	superadminStaffRoutes "kucek-backend/routes/superadmin/staff"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()

	// Global Middlewares
	r.Use(gin.Recovery())
	r.Use(logger.RequestLogger())
	r.Use(cors.CORSMiddleware())

	apiV1 := r.Group("/api/v1")
	{
		// 1. Role: Public (Tanpa Token)
		publicHealthRoutes.RegisterHealthRoutes(apiV1)
		publicAuthRoutes.RegisterPublicAuthRoutes(apiV1)
		publicTrackingRoutes.RegisterTrackingRoutes(apiV1)
		publicCatalogRoutes.RegisterCatalogRoutes(apiV1)

		// 2. Authenticated Group
		authProtected := apiV1.Group("")
		authProtected.Use(jwt.AuthMiddleware())
		{
			publicAuthRoutes.RegisterProtectedAuthRoutes(authProtected)

			// Role: Pelanggan (per Fitur)
			pelangganHubRoutes.RegisterCustomerHubRoutes(authProtected)
			pelangganPickupRoutes.RegisterCustomerPickupRoutes(authProtected)
			pelangganSubRoutes.RegisterCustomerSubscriptionRoutes(authProtected)
			pelangganHistoryRoutes.RegisterCustomerHistoryRoutes(authProtected)
			pelangganProfileRoutes.RegisterCustomerProfileRoutes(authProtected)
			pelangganVoucherRoutes.RegisterCustomerVoucherRoutes(authProtected)

			// Role: Superadmin & Staf Operasional (per Fitur)
			adminGroup := authProtected.Group("")
			adminGroup.Use(role.RequireRoles(
				account.RoleSuperAdmin,
				account.RoleKasir,
				account.RoleOperator,
				account.RoleKurir,
			))
			{
				superadminDashboardRoutes.RegisterDashboardRoutes(adminGroup)
				superadminPosRoutes.RegisterPosRoutes(adminGroup)
				superadminProductionRoutes.RegisterProductionRoutes(adminGroup)
				superadminDispatchRoutes.RegisterDispatchRoutes(adminGroup)
				superadminCustomerRoutes.RegisterCustomerRoutes(adminGroup)
				superadminPackageRoutes.RegisterPackageManagementRoutes(adminGroup)
				superadminFinanceRoutes.RegisterFinanceRoutes(adminGroup)
				superadminStaffRoutes.RegisterStaffRoutes(adminGroup)
			}
		}
	}

	return r
}
