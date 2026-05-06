import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import multer from "multer";
import { HttpError } from "../errors/httpError";

const signatureUploadDir = path.resolve(process.cwd(), "uploads", "mandate-signatures");

mkdirSync(signatureUploadDir, { recursive: true });

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
