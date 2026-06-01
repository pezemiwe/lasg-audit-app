import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { openApiDocument } from "./docs/openApi";
import { errorHandler, notFound } from "./common/middleware/errorHandler";
import { sendSuccess } from "./common/responses/apiResponse";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import zoneRoutes from "./modules/zones/zones.routes";
import councilRoutes from "./modules/councils/councils.routes";
import activityRoutes from "./modules/activity/activity.routes";
import roleRoutes from "./modules/roles/roles.routes";
import mandateRoutes from "./modules/mandates/mandates.routes";
import auditRoutes from "./modules/audits/audits.routes";
import {
  auditEngagementsRouter,
  myAuditEngagementsRouter,
} from "./modules/audit-engagements/audit-engagements.routes";
import documentRequirementRoutes from "./modules/document-requirements/document-requirements.routes";
import auditDocumentRoutes from "./modules/audit-documents/audit-documents.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  sendSuccess(res, { status: "ok", service: "lasg-audit-server" });
});

app.get("/docs.json", (_req, res) => {
  res.json(openApiDocument);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/zones", zoneRoutes);
app.use("/api/v1/councils", councilRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/mandates", mandateRoutes);
app.use("/api/v1/audits", auditRoutes);
app.use("/api/v1/my-audit-engagements", myAuditEngagementsRouter);
app.use("/api/v1/audit-engagements", auditEngagementsRouter);
app.use("/api/v1/document-requirements", documentRequirementRoutes);
app.use("/api/v1/audit-documents", auditDocumentRoutes);

app.use(notFound);
app.use(errorHandler);
