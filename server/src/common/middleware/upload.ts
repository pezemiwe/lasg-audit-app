import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import multer from "multer";
import { HttpError } from "../errors/httpError";

const signatureUploadDir = path.resolve(process.cwd(), "uploads", "mandate-signatures");
const auditDocumentUploadDir = path.resolve(process.cwd(), "uploads", "audit-documents");

mkdirSync(signatureUploadDir, { recursive: true });
mkdirSync(auditDocumentUploadDir, { recursive: true });

const signatureStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, signatureUploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${extension}`);
  },
});

export const uploadMandateSignature = multer({
  storage: signatureStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new HttpError(400, "Signature must be a PNG, JPEG, or WEBP image"));
    }

    cb(null, true);
  },
});

const auditDocumentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, auditDocumentUploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${extension}`);
  },
});

export const uploadAuditDocument = multer({
  storage: auditDocumentStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new HttpError(400, "Document must be PDF, Word, Excel, CSV, PNG, JPEG, or WEBP"));
    }

    cb(null, true);
  },
});
