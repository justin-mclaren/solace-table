## Solace Candidate Assignment

A live demo of this project is available here: https://solace-table.vercel.app/

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies:

```bash
pnpm i
```

Run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

This project uses **PostgreSQL** with **Drizzle ORM** for type-safe database access.

### Option 1: Docker (Recommended)

1. Start the PostgreSQL container:

```bash
docker compose up -d
```

This creates a database named `solaceassignment` with user `postgres` and password `password`.

2. Set your database URL in `.env`:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/solaceassignment
```

3. Run migrations:

```bash
pnpm migrate:up
```

This runs the migration script (`src/db/migrate.js`) which applies all migrations from the `drizzle/` folder.

4. Seed the database:

```bash
curl -X POST http://localhost:3000/api/seed
```

### Option 2: Your Own PostgreSQL Instance

If you prefer to use your own PostgreSQL installation:

1. Create a database named `solaceassignment`
2. Set `DATABASE_URL` in `.env` to your connection string
3. Run migrations: `pnpm migrate:up`
4. Seed the database: `curl -X POST http://localhost:3000/api/seed`

### Database Patterns

**Migrations**: This project uses Drizzle migrations for schema changes. Migrations are stored in `drizzle/` and automatically run during build (`pnpm build`) and can be manually run with `pnpm migrate:up`.

**Schema**: Defined in `src/db/schema.ts` using Drizzle ORM's schema builder.

**Query Pattern**: Database queries are handled in API routes (`src/app/api/`) using Drizzle's query builder for type-safe SQL.

## Available Scripts

### Development

- `pnpm dev` - Start the Next.js development server
- `pnpm build` - Build the application for production (includes running migrations)
- `pnpm start` - Start the production server

### Database

- `pnpm migrate:up` - Run pending database migrations
- `pnpm generate` - Generate new migration files from schema changes

### Code Quality & CI

This project includes static analysis tools that run in CI to maintain code quality:

- `pnpm lint` - Run ESLint to check for code issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check if code is formatted correctly (used in CI)
- `pnpm typecheck` - Run TypeScript type checking
