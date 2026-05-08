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
- User, role, zone, council, mandate, and activity endpoints
- Role-based middleware
- Request validation middleware
- Central error handling
- Audit log helper for write actions
- Seed data for 5 zones, 57 councils, and starter users

## Source Layout

```txt
src/
  app.ts
  server.ts

  config/
    env.ts
    prisma.ts

  common/
    middleware/
    utils/
    responses/
    errors/

  modules/
    auth/
    users/
    zones/
    councils/
    mandates/
    activity/
    roles/
```

Each module owns its route, controller, service, repository, validator, and serializer files where applicable.

## Setup

```txt
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Swagger UI is available at:

```txt
http://localhost:5000/docs
```

The raw OpenAPI document is available at:

```txt
http://localhost:5000/docs.json
```

Prisma 7 notes:

- The database URL is configured for Prisma CLI/Migrate in `prisma.config.ts`.
- `schema.prisma` intentionally does not contain a datasource `url`.
- The generated Prisma client is written to `src/generated/prisma`.
- Runtime database access is configured in `src/config/prisma.ts` with `PrismaPg`.

## Required Environment

```txt
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lasg"
JWT_ACCESS_SECRET="replace-with-a-long-random-access-secret"
JWT_RESET_SECRET="replace-with-a-long-random-reset-secret"
```

## Seeded Users

All seeded users use this development password:

```txt
password123
```

```txt
sysadmin@lasg.gov.ng
ag@lasg.gov.ng
sup.mushin@lasg.gov.ng
jide.johnson@lasg.gov.ng
auditor.ige@lasg.gov.ng
hlga.mushin@lasg.gov.ng
```

## Validation

```txt
npm run typecheck
npm run build
npx prisma validate
```

## Current Migration Notes

After pulling changes that add mandate tracking, create/apply a migration:

```txt
npm run prisma:migrate -- --name add_mandates
```
