package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {

	// Connect Database
	ConnectDB()
	defer db.Close()

	// Create Router
	r := mux.NewRouter()

	// ==========================
	// DVD CRUD
	// ==========================

	r.HandleFunc("/dvds", GetDVDs).Methods("GET")
	r.HandleFunc("/dvd/{id}", GetDVD).Methods("GET")
	r.HandleFunc("/dvd", AddDVD).Methods("POST")
	r.HandleFunc("/dvd/{id}", UpdateDVD).Methods("PUT")
	r.HandleFunc("/dvd/{id}", DeleteDVD).Methods("DELETE")

	// ==========================
	// Search
	// ==========================

	r.HandleFunc("/search/name/{name}", SearchByName).Methods("GET")
	r.HandleFunc("/search/director/{director}", SearchByDirector).Methods("GET")
	r.HandleFunc("/search/genre/{genre}", SearchByGenre).Methods("GET")

	// ==========================
	// Borrow & Return
	// ==========================

	r.HandleFunc("/borrow", BorrowDVD).Methods("POST")
	r.HandleFunc("/return/{id}", ReturnDVD).Methods("PUT")

	// ==========================
	// Reports
	// ==========================

	r.HandleFunc("/available", AvailableDVDs).Methods("GET")
	r.HandleFunc("/borrowed", BorrowedDVDs).Methods("GET")
	r.HandleFunc("/generatefine", GenerateFine).Methods("PUT")

	// ==========================
	// Start Server
	// ==========================

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // Local development
	}

	log.Printf("🚀 Server running on port %s\n", port)

	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	err := http.ListenAndServe(":"+port, cors(r))
	if err != nil {
		log.Fatal(err)
	}
}
