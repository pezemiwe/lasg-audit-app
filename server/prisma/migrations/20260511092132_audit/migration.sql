-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'PRE_AUDIT', 'PLANNING', 'FIELDWORK', 'REVIEW', 'REPORTING', 'POST_AUDIT', 'COMPLETED');

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "mandateId" TEXT NOT NULL,
    "mandateCouncilId" TEXT NOT NULL,
    "councilId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "auditTypes" "AuditType"[] DEFAULT ARRAY[]::"AuditType"[],
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "leadId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audit_mandateCouncilId_key" ON "Audit"("mandateCouncilId");

-- CreateIndex
CREATE INDEX "Audit_mandateId_idx" ON "Audit"("mandateId");

-- CreateIndex
CREATE INDEX "Audit_councilId_idx" ON "Audit"("councilId");

-- CreateIndex
CREATE INDEX "Audit_zoneId_idx" ON "Audit"("zoneId");

-- CreateIndex
CREATE INDEX "Audit_status_idx" ON "Audit"("status");

-- CreateIndex
CREATE INDEX "Audit_leadId_idx" ON "Audit"("leadId");

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_mandateId_fkey" FOREIGN KEY ("mandateId") REFERENCES "Mandate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_mandateCouncilId_fkey" FOREIGN KEY ("mandateCouncilId") REFERENCES "MandateCouncil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
