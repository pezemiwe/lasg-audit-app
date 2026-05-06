/*
  Warnings:

  - The values [CLOSED] on the enum `MandateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MandateStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED');
ALTER TABLE "public"."Mandate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Mandate" ALTER COLUMN "status" TYPE "MandateStatus_new" USING ("status"::text::"MandateStatus_new");
ALTER TYPE "MandateStatus" RENAME TO "MandateStatus_old";
ALTER TYPE "MandateStatus_new" RENAME TO "MandateStatus";
DROP TYPE "public"."MandateStatus_old";
ALTER TABLE "Mandate" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
