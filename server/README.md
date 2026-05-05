# LASG Audit Server

Node.js + Express + TypeScript backend for the LASG Audit Automation Platform.

## Phase 1 Scope

Implemented foundation:

- Express API under `/api/v1`
- PostgreSQL Prisma 7 schema and generated client
- `prisma.config.ts` datasource config for Prisma Migrate
- `@prisma/adapter-pg` direct database adapter for runtime access
- JWT login and authenticated `/auth/me`
- Password reset token flow
- User, role, zone, council, and audit trail endpoints
- Role-based middleware
- Request validation middleware
- Central error handling
- Audit log helper for write actions
- Seed data for 5 zones, 57 councils, and starter users

## Setup

```txt
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Prisma 7 notes:

- The database URL is configured for Prisma CLI/Migrate in `prisma.config.ts`.
- `schema.prisma` intentionally does not contain a datasource `url`.
- The generated Prisma client is written to `src/generated/prisma`.
- Runtime database access is configured in `src/config/prisma.ts` with `PrismaPg`.

## Required Environment

```txt
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lasg?schema=public"
JWT_ACCESS_SECRET="replace-with-a-long-random-access-secret"
JWT_RESET_SECRET="replace-with-a-long-random-reset-secret"
```

## Seeded Users

All seeded users use this development password:

```txt
Password123!
```

```txt
admin@lasg-audit.local
ag@lasg-audit.local
supervisor.ikeja@lasg-audit.local
lead@lasg-audit.local
auditor@lasg-audit.local
holg.ikeja@lasg-audit.local
```

## Validation

```txt
npm run typecheck
npm run build
npx prisma validate
```
