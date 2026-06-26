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
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env")
	}

	connStr := os.Getenv("DB_URL")

	db, err = pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database Connected!")
}
