CREATE TABLE IF NOT EXISTS dvd(
    SR SERIAL PRIMARY KEY,
    dvd_name TEXT,
    director VARCHAR(50) UNIQUE,
    dvd_id INTEGER ,
    genre VARCHAR(50), 
)


CREATE TABLE IF NOT EXISTS borrower(
    SR SERIAL,
    borrower_name VARCHAR(50),
    dvd_id INTEGER PRIMARY KEY,
    issue_date DATE,
    return_date DATE,
    fine INTEGER,
    FOREIGN KEY(dvd_id)
    REFERENCES dvd(dvd_id)
);

ALTER TABLE dvd
DROP CONSTRAINT dvd_director_key