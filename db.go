package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var db *pgxpool.Pool

func ConnectDB() {

	// Load .env locally. Ignore the error on Render.
	if err := godotenv.Load(); err != nil {
		log.Println(".env not found, using environment variables")
	}

	connStr := os.Getenv("DB_URL")
	if connStr == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	var err error
	db, err = pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping(context.Background())
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	log.Println("✅ Database Connected!")
}
