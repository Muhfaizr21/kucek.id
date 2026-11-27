package config

import (
	"log"
	"time"

	"kucek-backend/database/migrations/schema"
	"kucek-backend/database/seeds"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB(cfg *Config) (*gorm.DB, error) {
	dsn := cfg.GetDSN()

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("PostgreSQL connection established successfully to database:", cfg.DBName)

	DB = db

	if err := schema.RunAutoMigrate(db); err != nil {
		log.Printf("Warning: auto-migration encountered an error: %v\n", err)
		return nil, err
	}

	seeds.RunAllSeeds(db)

	return DB, nil
}
