-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('FINANCIAL', 'PERFORMANCE', 'COMPLIANCE', 'COMBINED');

-- CreateEnum
CREATE TYPE "MandateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MandateTargetMode" AS ENUM ('ALL_COUNCILS', 'SELECTED_COUNCILS');

-- CreateEnum
CREATE TYPE "MandateCouncilStatus" AS ENUM ('PENDING_ACCEPTANCE', 'ACCEPTED');

-- CreateTable
CREATE TABLE "Mandate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "scope" TEXT NOT NULL,
    "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "auditTypes" "AuditType"[] DEFAULT ARRAY[]::"AuditType"[],
    "signatureUrl" TEXT NOT NULL,
    "targetMode" "MandateTargetMode" NOT NULL DEFAULT 'ALL_COUNCILS',
    "status" "MandateStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mandate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandateCouncil" (
    "id" TEXT NOT NULL,
    "mandateId" TEXT NOT NULL,
    "councilId" TEXT NOT NULL,
    "status" "MandateCouncilStatus" NOT NULL DEFAULT 'PENDING_ACCEPTANCE',
    "acceptedById" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "documentPortalUnlockedAt" TIMESTAMP(3),
    "questionnaireUnlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MandateCouncil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mandate_year_idx" ON "Mandate"("year");

-- CreateIndex
CREATE INDEX "Mandate_status_idx" ON "Mandate"("status");

-- CreateIndex
CREATE INDEX "Mandate_targetMode_idx" ON "Mandate"("targetMode");

-- CreateIndex
CREATE INDEX "Mandate_createdById_idx" ON "Mandate"("createdById");

-- CreateIndex
CREATE INDEX "MandateCouncil_councilId_idx" ON "MandateCouncil"("councilId");

-- CreateIndex
CREATE INDEX "MandateCouncil_status_idx" ON "MandateCouncil"("status");

-- CreateIndex
CREATE INDEX "MandateCouncil_acceptedById_idx" ON "MandateCouncil"("acceptedById");

-- CreateIndex
CREATE UNIQUE INDEX "MandateCouncil_mandateId_councilId_key" ON "MandateCouncil"("mandateId", "councilId");

-- AddForeignKey
ALTER TABLE "Mandate" ADD CONSTRAINT "Mandate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandateCouncil" ADD CONSTRAINT "MandateCouncil_mandateId_fkey" FOREIGN KEY ("mandateId") REFERENCES "Mandate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandateCouncil" ADD CONSTRAINT "MandateCouncil_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandateCouncil" ADD CONSTRAINT "MandateCouncil_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
