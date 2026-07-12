# BookNest API

A Booking Platform REST API built with NestJS, TypeORM, and PostgreSQL, allowing users to manage services and customer bookings with JWT-based authentication.

## Project Overview

BookNest API is a backend service for a booking platform. Authenticated users (e.g. business staff) can manage services, while customers can create bookings without needing an account. The system enforces core business rules such as preventing bookings on non-existent services, blocking past-dated bookings, and preventing cancelled bookings from being marked as completed.

**Tech Stack**
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM (with migrations, no `synchronize`)
- **Auth:** JWT (Passport) + bcrypt password hashing
- **Validation:** class-validator / class-transformer
- **Docs:** Postman Collection (see `/postman`)

---

## Installation Steps

**Prerequisites:** Node.js 20+, PostgreSQL 14+, npm

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/book-nest-api.git
cd book-nest-api

# Install dependencies
npm install
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description | Example | To get One |
|---|---|---|----|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `yourpassword` |
| `DB_NAME` | Database name | `booking_platform` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_super_secret_key` | node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" |
| `JWT_EXPIRES_IN` | JWT expiry duration | `1d` |
| `PORT` | App port (optional) | `3000` |

---

## Database Setup

Create the database in PostgreSQL:

```bash
psql -U postgres -c "CREATE DATABASE booking_platform;"
```

---

## Running the Application

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

---

## Running Migrations

To set up the database schema, run all existing migrations:

```bash
npm run migration:run
```

This applies the migration files already included in `src/database/migrations/`, creating the `users`, `services`, and `bookings` tables.

---

<details>
<summary>For developers: generating new migrations</summary>

If you modify an entity and need to create a new migration:

```bash
npm run migration:generate src/database/migrations/MigrationName
```

To undo the most recent migration:

```bash
npm run migration:revert
```

</details>

## API Documentation

A Postman Collection and Environment are provided in the `/postman` folder:

- `postman/booknest-api.postman_collection.json`
- `postman/booknest-api.postman_environment.json`

**To use:**
1. Import both files into Postman
2. Select the **BookNest Local** environment
3. Run **Auth → Register** to create a test user
4. Run **Auth → Login** — this automatically saves your access token to the environment
5. All other requests will use the saved token and IDs automatically

### Endpoints Summary

**Auth**
| Method | Endpoint | Auth Required |
|---|---|---|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |

**Services**
| Method | Endpoint | Auth Required |
|---|---|---|
| POST | `/services` | Yes |
| GET | `/services` | No |
| GET | `/services/:id` | No |
| PATCH | `/services/:id` | Yes |
| DELETE | `/services/:id` | Yes |

**Bookings**
| Method | Endpoint | Auth Required |
|---|---|---|
| POST | `/bookings` | No |
| GET | `/bookings` (supports `?customerName=` search) | No |
| GET | `/bookings/:id` | No |
| PATCH | `/bookings/:id/status` |Yes |
| PATCH | `/bookings/:id/cancel` | Yes |

---

## Assumptions Made

- **Booking status enum**: The assignment lists `PENDING`, `CONFIRMED`, `CANCELLED`, but the business rule "cancelled bookings cannot be marked as completed" implies a `COMPLETED` status exists. Added `COMPLETED` to the enum accordingly.
- **Authentication scope**: Only Service management (`Create`, `Update`, `Delete`) requires authentication, per the explicit rule "only authenticated users can manage services." `Get All Services` / `Get Service by ID` are left public since the assignment doesn't restrict read access. All Booking endpoints are public, per "customers can create bookings without authentication" — this was extended to all booking endpoints since no distinction was specified for read/update actions.
- **Primary keys**: Used UUIDs instead of auto-increment integers to avoid exposing sequential, guessable IDs on publicly-accessible endpoints (e.g. booking creation).
- **Service deletion**: A service cannot be deleted while it has existing bookings (enforced via a `RESTRICT` foreign key constraint), returning a `409 Conflict` instead of silently orphaning bookings.
- **Cancel Booking endpoint**: Implemented as a dedicated `PATCH /bookings/:id/cancel` route in addition to the generic `PATCH /bookings/:id/status`, since "Cancel Booking" is listed as its own required API.

---

## Bonus Features Implemented

- [x] Validation (class-validator DTOs + global ValidationPipe)
- [x] Search bookings (by `customerName`, case-insensitive)
- [x] Prevent duplicate bookings for the same service, date, and time
- [x] Filter by status
- [x] Global Exception Handling
- [ ] Pagination
- [ ] Swagger documentation
- [ ] Docker support
- [ ] Refresh Token
- [ ] Unit Testing


---

## Project Structure

```
src/
  auth/              # Register, Login, JWT strategy & guard
  users/             # User entity
  services/          # Service CRUD (protected write, public read)
  bookings/          # Booking CRUD + business rules
  common/enums/       # BookingStatus enum
  database/          # TypeORM DataSource + migrations
  app.module.ts
  main.ts
postman/             # Postman collection + environment
```
