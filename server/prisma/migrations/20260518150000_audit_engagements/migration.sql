-- CreateTable
CREATE TABLE "AuditEngagement" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "mandateCouncilId" TEXT NOT NULL,
    "councilId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "leadId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditEngagement_pkey" PRIMARY KEY ("id")
);

-- Drop old document relation before moving documents under engagements.
ALTER TABLE "AuditDocument" DROP CONSTRAINT "AuditDocument_auditId_fkey";
DROP INDEX "AuditDocument_auditId_idx";
DROP INDEX "AuditDocument_auditId_documentRequirementId_key";
ALTER TABLE "AuditDocument" RENAME COLUMN "auditId" TO "auditEngagementId";

-- Move each existing council-level Audit row into AuditEngagement.
WITH audit_parent AS (
    SELECT DISTINCT ON ("mandateId") "mandateId", "id"
    FROM "Audit"
    ORDER BY "mandateId", "createdAt", "id"
)
INSERT INTO "AuditEngagement" (
    "id",
    "auditId",
    "mandateCouncilId",
    "councilId",
    "zoneId",
    "status",
    "progress",
    "leadId",
    "startedAt",
    "completedAt",
    "createdAt",
    "updatedAt"
)
SELECT
    audit."id",
    audit_parent."id",
    audit."mandateCouncilId",
    audit."councilId",
    audit."zoneId",
    audit."status",
    audit."progress",
    audit."leadId",
    audit."startedAt",
    audit."completedAt",
    audit."createdAt",
    audit."updatedAt"
FROM "Audit" audit
JOIN audit_parent ON audit_parent."mandateId" = audit."mandateId";

-- Remove old council-level Audit constraints before collapsing Audit to mandate-level.
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_mandateCouncilId_fkey";
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_councilId_fkey";
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_zoneId_fkey";
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_leadId_fkey";
DROP INDEX "Audit_mandateCouncilId_key";
DROP INDEX "Audit_mandateId_idx";
DROP INDEX "Audit_councilId_idx";
DROP INDEX "Audit_zoneId_idx";
DROP INDEX "Audit_leadId_idx";

-- Keep one parent Audit per mandate.
WITH audit_parent AS (
    SELECT DISTINCT ON ("mandateId") "mandateId", "id"
    FROM "Audit"
    ORDER BY "mandateId", "createdAt", "id"
)
DELETE FROM "Audit" audit
USING audit_parent
WHERE audit."mandateId" = audit_parent."mandateId"
  AND audit."id" <> audit_parent."id";

ALTER TABLE "Audit" DROP COLUMN "mandateCouncilId";
ALTER TABLE "Audit" DROP COLUMN "councilId";
ALTER TABLE "Audit" DROP COLUMN "zoneId";
ALTER TABLE "Audit" DROP COLUMN "leadId";

-- CreateIndex
CREATE UNIQUE INDEX "Audit_mandateId_key" ON "Audit"("mandateId");
CREATE INDEX "Audit_year_idx" ON "Audit"("year");
CREATE UNIQUE INDEX "AuditEngagement_mandateCouncilId_key" ON "AuditEngagement"("mandateCouncilId");
CREATE INDEX "AuditEngagement_auditId_idx" ON "AuditEngagement"("auditId");
CREATE INDEX "AuditEngagement_councilId_idx" ON "AuditEngagement"("councilId");
CREATE INDEX "AuditEngagement_zoneId_idx" ON "AuditEngagement"("zoneId");
CREATE INDEX "AuditEngagement_status_idx" ON "AuditEngagement"("status");
CREATE INDEX "AuditEngagement_leadId_idx" ON "AuditEngagement"("leadId");
CREATE INDEX "AuditDocument_auditEngagementId_idx" ON "AuditDocument"("auditEngagementId");
CREATE UNIQUE INDEX "AuditDocument_auditEngagementId_documentRequirementId_key" ON "AuditDocument"("auditEngagementId", "documentRequirementId");

-- AddForeignKey
ALTER TABLE "AuditEngagement" ADD CONSTRAINT "AuditEngagement_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEngagement" ADD CONSTRAINT "AuditEngagement_mandateCouncilId_fkey" FOREIGN KEY ("mandateCouncilId") REFERENCES "MandateCouncil"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditEngagement" ADD CONSTRAINT "AuditEngagement_councilId_fkey" FOREIGN KEY ("councilId") REFERENCES "Council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEngagement" ADD CONSTRAINT "AuditEngagement_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditEngagement" ADD CONSTRAINT "AuditEngagement_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditDocument" ADD CONSTRAINT "AuditDocument_auditEngagementId_fkey" FOREIGN KEY ("auditEngagementId") REFERENCES "AuditEngagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
