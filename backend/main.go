package main

import (
	"log"
	"net/http"
	"time"

	"kucek-backend/config"
	"kucek-backend/routes"
)

func main() {
	// 1. Muat konfigurasi .env
	cfg := config.LoadConfig()

	// 2. Hubungkan ke PostgreSQL Database (DBeaver credentials)
	_, err := config.InitDB(cfg)
	if err != nil {
		log.Fatalf("FATAL: Gagal menghubungkan ke database PostgreSQL: %v", err)
	}

	// 3. Inisialisasi router Gin dengan arsitektur MVC
	router := routes.SetupRouter()

	// 4. Siapkan HTTP Server
	server := &http.Server{
		Addr:           ":" + cfg.Port,
		Handler:        router,
		ReadTimeout:    15 * time.Second,
		WriteTimeout:   15 * time.Second,
		MaxHeaderBytes: 1 << 20, // 1 MB
	}

	log.Printf("==================================================")
	log.Printf("🚀 kucek.id Backend berjalan pada port :%s", cfg.Port)
	log.Printf("📡 Environment: %s", cfg.Env)
	log.Printf("🗄️  Connected to PostgreSQL DB: %s @ %s:%s", cfg.DBName, cfg.DBHost, cfg.DBPort)
	log.Printf("🛡️  Auth: JWT & HttpOnly Cookie Active")
	log.Printf("==================================================")

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("FATAL: Server HTTP berhenti: %v", err)
	}
}
