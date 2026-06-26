package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func respondWithJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

// =====================================
// GET ALL DVDS
// =====================================

func GetDVDs(w http.ResponseWriter, r *http.Request) {

	rows, err := db.Query(context.Background(),
		`SELECT sr,dvd_name,dvd_id,director,genre FROM dvd`)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var dvds []DVD

	for rows.Next() {

		var dvd DVD

		err := rows.Scan(
			&dvd.Sr,
			&dvd.DVDName,
			&dvd.DVDID,
			&dvd.Director,
			&dvd.Genre,
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		dvds = append(dvds, dvd)

	}

	respondWithJSON(w, http.StatusOK, dvds)

}

// =====================================
// GET SINGLE DVD
// =====================================

func GetDVD(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid DVD ID", http.StatusBadRequest)
		return
	}

	var dvd DVD

	err = db.QueryRow(
		context.Background(),
		`SELECT sr,dvd_name,dvd_id,director,genre
		 FROM dvd
		 WHERE dvd_id=$1`,
		id,
	).Scan(
		&dvd.Sr,
		&dvd.DVDName,
		&dvd.DVDID,
		&dvd.Director,
		&dvd.Genre,
	)

	if err != nil {
		http.Error(w, "DVD not found", http.StatusNotFound)
		return
	}

	respondWithJSON(w, http.StatusOK, dvd)

}

// =====================================
// ADD DVD
// =====================================

func AddDVD(w http.ResponseWriter, r *http.Request) {

	var dvd DVD

	err := json.NewDecoder(r.Body).Decode(&dvd)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	_, err = db.Exec(
		context.Background(),
		`INSERT INTO dvd
		(dvd_name,dvd_id,director,genre)
		VALUES($1,$2,$3,$4)`,
		dvd.DVDName,
		dvd.DVDID,
		dvd.Director,
		dvd.Genre,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, http.StatusCreated, map[string]string{
		"message": "DVD Added Successfully",
	})

}

// =====================================
// UPDATE DVD
// =====================================

func UpdateDVD(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid DVD ID", http.StatusBadRequest)
		return
	}

	var dvd DVD

	err = json.NewDecoder(r.Body).Decode(&dvd)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	commandTag, err := db.Exec(
		context.Background(),
		`UPDATE dvd
		SET
			dvd_name=$1,
			director=$2,
			genre=$3
		WHERE dvd_id=$4`,
		dvd.DVDName,
		dvd.Director,
		dvd.Genre,
		id,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if commandTag.RowsAffected() == 0 {
		http.Error(w, "DVD not found", http.StatusNotFound)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "DVD Updated Successfully",
	})

}

// =====================================
// DELETE DVD
// =====================================

func DeleteDVD(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])

	if err != nil {
		http.Error(w, "Invalid DVD ID", http.StatusBadRequest)
		return
	}

	commandTag, err := db.Exec(
		context.Background(),
		`DELETE FROM dvd WHERE dvd_id=$1`,
		id,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if commandTag.RowsAffected() == 0 {
		http.Error(w, "DVD not found", http.StatusNotFound)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "DVD Deleted Successfully",
	})

}

// =====================================
// SEARCH BY DVD NAME
// GET /search/name/{name}
// =====================================

func SearchByName(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	name := params["name"]

	rows, err := db.Query(
		context.Background(),
		`SELECT sr,dvd_name,dvd_id,director,genre
		 FROM dvd
		 WHERE dvd_name ILIKE '%' || $1 || '%'`,
		name,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var dvds []DVD

	for rows.Next() {

		var dvd DVD

		err := rows.Scan(
			&dvd.Sr,
			&dvd.DVDName,
			&dvd.DVDID,
			&dvd.Director,
			&dvd.Genre,
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		dvds = append(dvds, dvd)
	}

	respondWithJSON(w, http.StatusOK, dvds)

}

// =====================================
// SEARCH BY DIRECTOR
// GET /search/director/{director}
// =====================================

func SearchByDirector(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	director := params["director"]

	rows, err := db.Query(
		context.Background(),
		`SELECT sr,dvd_name,dvd_id,director,genre
		 FROM dvd
		 WHERE director ILIKE '%' || $1 || '%'`,
		director,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var dvds []DVD

	for rows.Next() {

		var dvd DVD

		err := rows.Scan(
			&dvd.Sr,
			&dvd.DVDName,
			&dvd.DVDID,
			&dvd.Director,
			&dvd.Genre,
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		dvds = append(dvds, dvd)
	}

	respondWithJSON(w, http.StatusOK, dvds)

}

// =====================================
// SEARCH BY GENRE
// GET /search/genre/{genre}
// =====================================

func SearchByGenre(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	genre := params["genre"]

	rows, err := db.Query(
		context.Background(),
		`SELECT sr,dvd_name,dvd_id,director,genre
		 FROM dvd
		 WHERE genre ILIKE '%' || $1 || '%'`,
		genre,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var dvds []DVD

	for rows.Next() {

		var dvd DVD

		err := rows.Scan(
			&dvd.Sr,
			&dvd.DVDName,
			&dvd.DVDID,
			&dvd.Director,
			&dvd.Genre,
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		dvds = append(dvds, dvd)
	}

	respondWithJSON(w, http.StatusOK, dvds)

}

// =====================================
// BORROW DVD
// POST /borrow
// =====================================

func BorrowDVD(w http.ResponseWriter, r *http.Request) {

	var borrower Borrower

	err := json.NewDecoder(r.Body).Decode(&borrower)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var count int

	err = db.QueryRow(
		context.Background(),
		`SELECT COUNT(*)
		 FROM borrower
		 WHERE dvd_id=$1
		 AND return_date IS NULL`,
		borrower.DVDID,
	).Scan(&count)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if count > 0 {
		http.Error(w, "DVD is already borrowed", http.StatusConflict)
		return
	}

	_, err = db.Exec(
		context.Background(),
		`INSERT INTO borrower
		(borrower_name,dvd_id,issue_date)
		VALUES($1,$2,$3)`,
		borrower.BorrowerName,
		borrower.DVDID,
		borrower.IssueDate,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, http.StatusCreated, map[string]string{
		"message": "DVD Borrowed Successfully",
	})

}

// =====================================
// RETURN DVD
// PUT /return/{id}
// =====================================

func ReturnDVD(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid DVD ID", http.StatusBadRequest)
		return
	}

	commandTag, err := db.Exec(
		context.Background(),
		`UPDATE borrower
		 SET return_date=CURRENT_DATE
		 WHERE dvd_id=$1
		 AND return_date IS NULL`,
		id,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if commandTag.RowsAffected() == 0 {
		http.Error(w, "DVD is not currently borrowed", http.StatusNotFound)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "DVD Returned Successfully",
	})

}

// =====================================
// AVAILABLE DVDS
// GET /available
// =====================================

func AvailableDVDs(w http.ResponseWriter, r *http.Request) {

	rows, err := db.Query(
		context.Background(),
		`SELECT sr,dvd_name,dvd_id,director,genre
		 FROM dvd
		 WHERE dvd_id NOT IN
		 (
		 	SELECT dvd_id
		 	FROM borrower
		 	WHERE return_date IS NULL
		 )`,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var dvds []DVD

	for rows.Next() {

		var dvd DVD

		err := rows.Scan(
			&dvd.Sr,
			&dvd.DVDName,
			&dvd.DVDID,
			&dvd.Director,
			&dvd.Genre,
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		dvds = append(dvds, dvd)
	}

	respondWithJSON(w, http.StatusOK, dvds)

}

// =====================================
// BORROWED DVDS
// GET /borrowed
// =====================================

func BorrowedDVDs(w http.ResponseWriter, r *http.Request) {

	rows, err := db.Query(
		context.Background(),
		`SELECT d.sr,
		        d.dvd_name,
		        d.dvd_id,
		        d.director,
		        d.genre
		 FROM dvd d
		 JOIN borrower b
		 ON d.dvd_id=b.dvd_id
		 WHERE b.return_date IS NULL`,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var dvds []DVD

	for rows.Next() {

		var dvd DVD

		err := rows.Scan(
			&dvd.Sr,
			&dvd.DVDName,
			&dvd.DVDID,
			&dvd.Director,
			&dvd.Genre,
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		dvds = append(dvds, dvd)
	}

	respondWithJSON(w, http.StatusOK, dvds)

}

// =====================================
// GENERATE FINE
// PUT /generatefine
// =====================================

func GenerateFine(w http.ResponseWriter, r *http.Request) {

	commandTag, err := db.Exec(
		context.Background(),
		`UPDATE borrower
		 SET fine =
		 CASE
		 	WHEN return_date IS NULL THEN
		 		GREATEST((CURRENT_DATE-issue_date)-7,0)*20
		 	ELSE
		 		GREATEST((return_date-issue_date)-7,0)*20
		 END`,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"message":      "Fine Generated Successfully",
		"rows_updated": commandTag.RowsAffected(),
	})

}
