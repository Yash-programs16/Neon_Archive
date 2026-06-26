package main

import "time"

type DVD struct {
	Sr       int    `json:"sr"`
	DVDName  string `json:"dvd_name"`
	DVDID    int    `json:"dvd_id"`
	Director string `json:"director"`
	Genre    string `json:"genre"`
}

type Borrower struct {
	Sr           int        `json:"sr"`
	BorrowerName string     `json:"borrower_name"`
	DVDID        int        `json:"dvd_id"`
	IssueDate    time.Time  `json:"issue_date"`
	ReturnDate   *time.Time `json:"return_date"`
	Fine         int        `json:"fine"`
}
