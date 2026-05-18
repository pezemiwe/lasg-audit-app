-- CreateEnum
CREATE TYPE "DocumentRequirementStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AuditDocumentStatus" AS ENUM ('NOT_UPLOADED', 'UPLOADED', 'REVIEWED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "DocumentRequirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiredFormat" TEXT NOT NULL,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "DocumentRequirementStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditDocument" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "documentRequirementId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiredFormat" TEXT NOT NULL,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "AuditDocumentStatus" NOT NULL DEFAULT 'NOT_UPLOADED',
    "fileUrl" TEXT,
    "originalFileName" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "uploadedById" TEXT,
    "uploadedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentRequirement_name_key" ON "DocumentRequirement"("name");

-- CreateIndex
CREATE INDEX "DocumentRequirement_status_idx" ON "DocumentRequirement"("status");

-- CreateIndex
CREATE INDEX "DocumentRequirement_sortOrder_idx" ON "DocumentRequirement"("sortOrder");

-- CreateIndex
CREATE INDEX "AuditDocument_auditId_idx" ON "AuditDocument"("auditId");

-- CreateIndex
CREATE INDEX "AuditDocument_documentRequirementId_idx" ON "AuditDocument"("documentRequirementId");

-- CreateIndex
CREATE INDEX "AuditDocument_status_idx" ON "AuditDocument"("status");

-- CreateIndex
CREATE INDEX "AuditDocument_uploadedById_idx" ON "AuditDocument"("uploadedById");

-- CreateIndex
CREATE INDEX "AuditDocument_reviewedById_idx" ON "AuditDocument"("reviewedById");

-- CreateIndex
CREATE UNIQUE INDEX "AuditDocument_auditId_documentRequirementId_key" ON "AuditDocument"("auditId", "documentRequirementId");

-- AddForeignKey
ALTER TABLE "AuditDocument" ADD CONSTRAINT "AuditDocument_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditDocument" ADD CONSTRAINT "AuditDocument_documentRequirementId_fkey" FOREIGN KEY ("documentRequirementId") REFERENCES "DocumentRequirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditDocument" ADD CONSTRAINT "AuditDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditDocument" ADD CONSTRAINT "AuditDocument_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
