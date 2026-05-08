/*
  Warnings:

  - The values [PENDING_ACCEPTANCE] on the enum `MandateCouncilStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MandateCouncilStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "public"."MandateCouncil" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MandateCouncil" ALTER COLUMN "status" TYPE "MandateCouncilStatus_new" USING ("status"::text::"MandateCouncilStatus_new");
ALTER TYPE "MandateCouncilStatus" RENAME TO "MandateCouncilStatus_old";
ALTER TYPE "MandateCouncilStatus_new" RENAME TO "MandateCouncilStatus";
DROP TYPE "public"."MandateCouncilStatus_old";
ALTER TABLE "MandateCouncil" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "MandateCouncil" ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedById" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "MandateCouncil_rejectedById_idx" ON "MandateCouncil"("rejectedById");

-- AddForeignKey
ALTER TABLE "MandateCouncil" ADD CONSTRAINT "MandateCouncil_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
