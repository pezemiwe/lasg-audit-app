import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import zoneRoutes from "./routes/zoneRoutes";
import councilRoutes from "./routes/councilRoutes";
import auditTrailRoutes from "./routes/auditTrailRoutes";
import roleRoutes from "./routes/roleRoutes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "lasg-audit-server" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/zones", zoneRoutes);
app.use("/api/v1/councils", councilRoutes);
app.use("/api/v1/audit-trail", auditTrailRoutes);

app.use(notFound);
app.use(errorHandler);
