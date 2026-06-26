## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Yash-programs16/Neon_Archive.git
cd Neon_Archive
```

### 2. Create the environment file

Copy `.env.example` to `.env` and update the database password.

```env
DB_URL=host=localhost port=5432 user=postgres password=YOUR_PASSWORD dbname=movies_db sslmode=disable
```

### 3. Create the database

```sql
CREATE DATABASE movies_db;
```

### 4. Initialize the database

Run:

- `schema.sql`
- `seed.sql`

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Start the backend

```bash
go run .
```

### 7. Start the frontend

```bash
npm start
```
