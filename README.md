# Neon_Archive
Neon Archive is a cybercore digital archive for managing DVD collections. Built with Go, PostgreSQL, React, and Tailwind CSS, it combines a retro-futuristic interface with practical library management features including CRUD operations, advanced search, borrow/return tracking, reports, and fine generation.


# Features

## DVD Management
- Add new DVDs
- Edit existing DVDs
- Delete DVDs
- View complete catalogue

## Search
- Search by DVD title
- Search by director
- Search by genre

## Borrowing System
- Borrow DVDs
- Return DVDs
- Track currently borrowed DVDs
- View available DVDs

## Reports
- Available DVDs
- Borrowed DVDs
- Fine generation
- Live statistics dashboard

## Interface
- Cybercore-inspired UI
- Floating desktop windows
- Responsive layout
- Animated dashboard
- Live archive status
- Retro system terminal aesthetic

---

# Tech Stack

### Backend
- Go
- Gorilla Mux
- PostgreSQL
- pgx Driver

### Frontend
- React
- Tailwind CSS
- Axios
- Lucide React Icons

### Database
- PostgreSQL

---

# Project Structure

```
moviesapi/
│
├── db.go
├── dvd.go
├── handler.go
├── main.go
├── schema.sql
├── seed.sql
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /dvds | Get all DVDs |
| GET | /dvd/{id} | Get DVD by ID |
| POST | /dvd | Add DVD |
| PUT | /dvd/{id} | Update DVD |
| DELETE | /dvd/{id} | Delete DVD |
| GET | /search/name | Search by title |
| GET | /search/director | Search by director |
| GET | /search/genre | Search by genre |
| POST | /borrow | Borrow DVD |
| POST | /return | Return DVD |
| GET | /available | Available DVDs |
| GET | /borrowed | Borrowed DVDs |
| GET | /fine | Generate fines |

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/neon-archive.git

cd neon-archive
```

---

## Backend Setup

Install Go dependencies.

```bash
go mod tidy
```

Create a PostgreSQL database.

```sql
CREATE DATABASE movies_db;
```

Import schema.

```bash
psql -U postgres -d movies_db -f schema.sql
```

(Optional)

```bash
psql -U postgres -d movies_db -f seed.sql
```

Create a `.env` file.

```env
DATABASE_URL=postgres://USERNAME:PASSWORD@localhost:5432/movies_db?sslmode=disable
```

Run backend.

```bash
go run .
```

Server:

```
http://localhost:8000
```

---

## Frontend Setup

Navigate to frontend.

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Run development server.

```bash
npm start
```

Frontend:

```
http://localhost:3000
```

---

# Learning Goals

This project was primarily built to learn:

- Building REST APIs in Go
- CRUD operations
- PostgreSQL integration
- Database relationships
- Environment variables
- HTTP routing with Gorilla Mux
- React frontend integration
- Full-stack application architecture

---

# Future Improvements

- JWT Authentication
- User accounts
- Role-based access control
- Docker support
- Unit testing
- Pagination
- File uploads
- Better analytics dashboard
- Docker Compose deployment
- Redis caching

---
