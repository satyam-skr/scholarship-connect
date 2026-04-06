# SmartScholar Backend

Express + TypeScript + Prisma + PostgreSQL backend for SmartScholar.

## Stack

- Node.js + Express + TypeScript
- PostgreSQL
- Prisma ORM
- JWT auth + RBAC
- Multer for file uploads
- SHA256 ledger chaining for transaction transparency

## Folder Layout

- src/controllers
- src/routes
- src/services
- src/middlewares
- src/utils
- src/prisma
- src/types
- src/app.ts
- src/server.ts

## Quick Start

1. Install dependencies:

```bash
cd backend
npm install
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Configure env:

```bash
cp .env.example .env
```

4. Generate Prisma client and sync schema:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Seed data:

```bash
npm run prisma:seed
```

6. Run server:

```bash
npm run dev
```

Server runs on `http://localhost:3001` by default.

## Auth & RBAC

- JWT required for protected routes via `Authorization: Bearer <token>`
- Roles supported: `donor`, `student`, `admin`, `institution`, `verifier`
- Role gates are enforced per route.

## Uploads

- Endpoint: `POST /api/students/:studentId/documents`
- Form fields: `file` and `type`
- Files saved to `uploads/` (configurable with `UPLOAD_DIR`)

## Ledger Chain Logic

Each ledger transaction stores:

- `id`
- `donorId`
- `studentId`
- `amount`
- `timestamp`
- `previousHash`
- `currentHash`

`currentHash = SHA256(id|donorId|studentId|amount|timestamp|previousHash)`

## API Contract

See `API_CONTRACT.md` for endpoint mapping and DTO compatibility with frontend services.

## API Docs

- Swagger UI: `http://localhost:3001/api/docs`
- OpenAPI JSON: `http://localhost:3001/api/openapi.json`
- Detailed endpoint guide: `API_DOCS.md`

## Test Credentials

See `TEST_CREDENTIALS.md` for seeded role-based accounts.

## Basic Testing

Use `requests.http` in VS Code REST Client or Postman equivalents.
