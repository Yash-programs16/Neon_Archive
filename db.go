package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func connector() {

	err := godotenv.Load()

	if err != nil {
		log.Fatal("error loading .env file")
	}
	connStr := os.Getenv("DB_URL")

	pool, err := pgxpool.New(context.Background(), connStr)

	if err != nil {
		log.Fatalf("Failed to connect to database:%v", err)
	}

}
